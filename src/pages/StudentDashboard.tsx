/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, Cpu, FileText, CheckCircle, 
  PlusCircle, ArrowLeft, X, Laptop, 
  ArrowRight, Search, Bell, ChevronDown, User, Camera,
  LogOut, History, CreditCard, AlertTriangle, 
  Printer, Download, QrCode, Smartphone, Info,
  Play, Image as ImageIcon, Video, Plus, Trash2, Check,
  Sliders, Calendar, Menu, RefreshCw, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, SupportTicket, Message } from '../types';
import { authService } from '../services/authService';
import { deviceService } from '../services/deviceService';
import { planService } from '../services/planService';
import { requestService } from '../services/requestService';

export const StudentDashboard: React.FC = () => {
  const { 
    user, profile, devices, tickets, subscription, payments,
    refreshData, logout, updateProfile, notifications, showToast,
    readNotification, clearNotification
  } = useApp();

  // Sidebar active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'devices' | 'make_request' | 'profile' | 'history' | 'notifications'>(
    () => (localStorage.getItem('studentActiveTab') as any) || 'dashboard'
  );
  
  useEffect(() => {
    localStorage.setItem('studentActiveTab', activeTab);
  }, [activeTab]);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dialog & Modal states
  const [selectedRequestForReceipt, setSelectedRequestForReceipt] = useState<SupportTicket | null>(null);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  
  // Custom Modern Success Modal for Device Addition
  const [showDeviceSuccessModal, setShowDeviceSuccessModal] = useState(false);
  const [lastAddedDevice, setLastAddedDevice] = useState<Device | null>(null);

  // Custom Video Lightbox modal
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Search & notifications overlay triggers
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Profile coordinates editor state binds
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || '');
  const [editUni, setEditUni] = useState(profile?.university || '');
  const [editAvatar, setEditAvatar] = useState(profile?.avatar_url || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [deviceAdding, setDeviceAdding] = useState(false);
  const [deviceUpdating, setDeviceUpdating] = useState(false);
  const [deviceDeleting, setDeviceDeleting] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  // New Device registration fields
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceBrand, setNewDeviceBrand] = useState('Asus');
  const [customBrand, setCustomBrand] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('');
  const [newDeviceOS, setNewDeviceOS] = useState('Windows 11');
  const [customOS, setCustomOS] = useState('');
  const [newDeviceSN, setNewDeviceSN] = useState('');
  const [newDeviceType, setNewDeviceType] = useState('laptop');
  const [customType, setCustomType] = useState('');
  const [deviceError, setDeviceError] = useState('');

  // Device files attachments
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [attachedImageFiles, setAttachedImageFiles] = useState<File[]>([]);
  const [attachedVideo, setAttachedVideo] = useState<string>('');
  const [attachedVideoFile, setAttachedVideoFile] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  // Device Custom fields
  const [customFields, setCustomFields] = useState<{ label: string; value: string }[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  // Edit Device form states
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null);

  const [editDevName, setEditDevName] = useState('');
  const [editDevBrand, setEditDevBrand] = useState('Asus');
  const [editCustomBrand, setEditCustomBrand] = useState('');
  const [editDevModel, setEditDevModel] = useState('');
  const [editDevOS, setEditDevOS] = useState('Windows 11');
  const [editCustomOS, setEditCustomOS] = useState('');
  const [editDevSN, setEditDevSN] = useState('');
  const [editDevType, setEditDevType] = useState('laptop');
  const [editCustomType, setEditCustomType] = useState('');
  const [editAttachedImages, setEditAttachedImages] = useState<string[]>([]);
  const [editAttachedImageFiles, setEditAttachedImageFiles] = useState<File[]>([]);
  const [editAttachedVideo, setEditAttachedVideo] = useState<string>('');
  const [editAttachedVideoFile, setEditAttachedVideoFile] = useState<File | null>(null);
  const [editCustomFields, setEditCustomFields] = useState<{ label: string; value: string }[]>([]);
  const [editFieldLabel, setEditFieldLabel] = useState('');
  const [editFieldValue, setEditFieldValue] = useState('');
  const [editImageLoading, setEditImageLoading] = useState(false);
  const [editVideoLoading, setEditVideoLoading] = useState(false);

  // Make Request state binds
  const [reqCategory, setReqCategory] = useState<SupportTicket['category']>('software');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqPriority, setReqPriority] = useState<SupportTicket['priority']>('medium');
  const [reqDeviceId, setReqDeviceId] = useState('');
  
  // Website request details
  const [webBusinessName, setWebBusinessName] = useState('');
  const [webSubdomain, setWebSubdomain] = useState('');
  const [webDescription, setWebDescription] = useState('');
  const [webPagesCount, setWebPagesCount] = useState(5);
  const [webHosting, setWebHosting] = useState(true);
  
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);

  // Active chat session
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [chatMessages, setChatMessages] = useState<{ message: Message; senderName: string; senderAvatar?: string }[]>([]);
  const [newMsgContent, setNewMsgContent] = useState('');

  // File Inputs references
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [plans, setPlans] = useState<any[]>([]);
  useEffect(() => {
    authService.getPlans()
      .then(setPlans)
      .catch(err => console.error('Failed to load plans:', err));
  }, []);

  // Auto-fill edits on user profiles loading
  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || '');
      setEditPhone(profile.phone || '');
      setEditUni(profile.residence || profile.university || '');
      setEditAvatar(profile.avatar_url || '');
      setEditAvatarFile(null);
    }
  }, [profile]);

  useEffect(() => {
    if (selectedTicket) {
      setChatMessages([]);
    }
  }, [selectedTicket]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size must be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
        setEditAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdating(true);
    const success = await updateProfile(editName, editPhone, editUni, editAvatarFile);
    setProfileUpdating(false);
    if (success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
      refreshData();
    }
  };

  const handleUpgradeDowngrade = async (planId: string) => {
    const confirmChange = window.confirm(`Are you sure you want to change your cover plan to ${planId.replace('-', ' ').toUpperCase()}?`);
    if (confirmChange) {
      try {
        const plans = await authService.getPlans();
        const mappedType = planId === 'bonanza-plan' ? 'BONANZA' : (planId === 'premium-plan' ? 'PREMIUM' : 'BASIC');
        const targetPlan = plans.find((p: any) => p.type === mappedType || p.id === planId);
        if (!targetPlan) {
          alert('Selected plan is not configured in the system.');
          return;
        }

        const isUpgrade = subscription && (targetPlan as any).fee > (subscription.plan_id === 'premium-plan' ? 50 : 20);
        let res;
        if (isUpgrade) {
          res = await planService.upgradePlan((targetPlan as any).id);
        } else {
          res = await planService.renewPlan((targetPlan as any).id);
        }

        if (res && res.data && res.data.authorization_url) {
          window.location.href = res.data.authorization_url;
        } else {
          alert(res.message || 'Plan change initiated successfully!');
          refreshData();
        }
      } catch (err: any) {
        console.error('Plan modification failed:', err);
        showToast('Plan change failed', 'error');
      }
    }
  };

  const handleRenewPlan = async () => {
    if (!subscription?.plan_id) return;
    setIsRenewing(true);
    try {
      const res = await planService.renewPlan(subscription.plan_id);
      const authUrl = res?.data?.data?.authorization_url || res?.data?.authorization_url;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        showToast(res.message || 'Plan renewal initiated successfully!', 'success');
        refreshData();
      }
    } catch (err: any) {
      console.error('Plan renewal failed:', err);
      showToast(err.message || 'Plan renewal failed', 'error');
    } finally {
      setIsRenewing(false);
    }
  };

  // Edit Device handlers
  const handleOpenEditModal = (dev: Device) => {
    setEditingDevice(dev);
    setEditDevName(dev.name);
    setEditDevModel(dev.model);
    setEditDevSN(dev.serial_number);
    
    // Check if brand is custom
    const commonBrands = ['Asus', 'Apple', 'HP', 'Dell', 'Lenovo', 'Acer'];
    if (commonBrands.includes(dev.brand)) {
      setEditDevBrand(dev.brand);
      setEditCustomBrand('');
    } else {
      setEditDevBrand('other');
      setEditCustomBrand(dev.brand);
    }

    // Check if type is custom
    const commonTypes = ['laptop', 'desktop', 'tablet', 'phone'];
    if (commonTypes.includes(dev.type)) {
      setEditDevType(dev.type);
      setEditCustomType('');
    } else {
      setEditDevType('other');
      setEditCustomType(dev.type);
    }

    // Check if OS is custom
    const commonOSs = ['Windows 11', 'Windows 10', 'macOS Sequoia', 'Linux Ubuntu', 'Android OS', 'iOS Standard'];
    if (commonOSs.includes(dev.operating_system)) {
      setEditDevOS(dev.operating_system);
      setEditCustomOS('');
    } else {
      setEditDevOS('other');
      setEditCustomOS(dev.operating_system);
    }

    setEditAttachedImages(dev.device_images || (dev.image_url ? [dev.image_url] : []));
    setEditAttachedVideo(dev.video_url || '');
    setEditCustomFields(dev.custom_fields || []);
  };

  const handleDeviceUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;
    setDeviceUpdating(true);

    const brandVal = editDevBrand === 'other' ? editCustomBrand : editDevBrand;
    const typeVal = editDevType === 'other' ? editCustomType : editDevType;
    const osVal = editDevOS === 'other' ? editCustomOS : editDevOS;

    const typeMap: Record<string, string> = {
      laptop: 'LAPTOP',
      phone: 'MOBILE_PHONE',
      desktop: 'DESKTOP',
      tablet: 'TABLET',
      other: 'OTHER'
    };
    const backendType = (typeMap[typeVal] || 'OTHER') as any;

    try {
      const mediaFiles = [...editAttachedImageFiles];
      if (editAttachedVideoFile) mediaFiles.push(editAttachedVideoFile);

      await deviceService.editDevice(editingDevice.id, {
        name: editDevName,
        type: backendType,
        brand: brandVal,
        model: editDevModel,
        serialCode: editDevSN,
        os: osVal,
        attributes: editCustomFields.map(f => ({ key: f.label, value: f.value })),
      }, mediaFiles);
      setDeviceUpdating(false);
      setEditingDevice(null);
      refreshData();
      showToast('Device specs updated successfully!', 'success');
    } catch (err: any) {
      setDeviceUpdating(false);
      console.error('API update device failed:', err);
      showToast('Device update failed', 'error');
    }
  };

  const handleDeviceDeleteSubmit = async () => {
    if (!deletingDevice) return;
    setDeviceDeleting(true);
    try {
      await deviceService.removeDevice(deletingDevice.id);
      setDeviceDeleting(false);
      setDeletingDevice(null);
      refreshData();
      showToast('Device removed from coverage logs.', 'success');
    } catch (err: any) {
      setDeviceDeleting(false);
      console.error('API remove device failed:', err);
      showToast('Device removal failed', 'error');
    }
  };

  const handleEditImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setEditImageLoading(true);

    const fileArray = Array.from(files) as File[];
    setEditAttachedImageFiles((prev) => [...prev, ...fileArray]);

    const loadPromises = fileArray.map((file: any) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loadPromises).then((results) => {
      setEditAttachedImages((prev) => [...prev, ...results]);
      setEditImageLoading(false);
    });
  };

  const handleEditVideoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditVideoLoading(true);

    setEditAttachedVideoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditAttachedVideo(reader.result as string);
      setEditVideoLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Device registration limit checks
  const activePlanType = subscription?.plan?.type || (subscription?.plan_id === 'premium-plan' ? 'PREMIUM' : subscription?.plan_id === 'bonanza-plan' ? 'BONANZA' : 'BASIC');
  const planId = subscription?.plan_id || 'basic-plan';
  const isBonanza = activePlanType === 'BONANZA';
  const isPremium = activePlanType === 'PREMIUM';
  const maxDevicesAllowed = subscription?.plan?.maxDevices || (isBonanza ? 3 : 1);
  const currentDevicesCount = devices.length;

  // File loading methods
  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImageLoading(true);

    const fileArray = Array.from(files) as File[];
    setAttachedImageFiles((prev) => [...prev, ...fileArray]);

    const loadPromises = fileArray.map((file: any) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loadPromises).then((results) => {
      setAttachedImages((prev) => [...prev, ...results]);
      setImageLoading(false);
    });
  };

  const handleVideoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoLoading(true);

    setAttachedVideoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedVideo(reader.result as string);
      setVideoLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const addCustomField = () => {
    if (newFieldLabel.trim() && newFieldValue.trim()) {
      setCustomFields([...customFields, { label: newFieldLabel.trim(), value: newFieldValue.trim() }]);
      setNewFieldLabel('');
      setNewFieldValue('');
    }
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleDeviceRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeviceError('');

    if (currentDevicesCount >= maxDevicesAllowed) {
      setDeviceError(`Plan Limit Reached: Your current plan only allows up to ${maxDevicesAllowed} registered device(s). Please upgrade to Bonanza to register up to 3 devices.`);
      return;
    }

    if (newDeviceName && newDeviceModel && newDeviceSN) {
      setDeviceAdding(true);
      const brandVal = newDeviceBrand === 'other' ? customBrand : newDeviceBrand;
      const typeVal = newDeviceType === 'other' ? customType : newDeviceType;
      const osVal = newDeviceOS === 'other' ? customOS : newDeviceOS;

      const typeMap: Record<string, string> = {
        laptop: 'LAPTOP',
        phone: 'MOBILE_PHONE',
        desktop: 'DESKTOP',
        tablet: 'TABLET',
        other: 'OTHER'
      };
      const backendType = (typeMap[typeVal] || 'OTHER') as any;

      try {
        const mediaFiles = [...attachedImageFiles];
        if (attachedVideoFile) mediaFiles.push(attachedVideoFile);

        const res = await deviceService.addDevice({
          type: backendType,
          model: newDeviceModel,
          serialCode: newDeviceSN,
          name: newDeviceName,
          brand: brandVal,
          os: osVal,
          attributes: customFields.map(f => ({ key: f.label, value: f.value })),
        }, mediaFiles);

        const newDev = res.data;
        const mappedDevice: Device = {
          id: newDev.id,
          user_id: newDev.subscriberId,
          name: newDev.name || `${newDev.brand} ${newDev.model}`,
          type: newDev.type.toLowerCase(),
          brand: newDev.brand || '',
          model: newDev.model || '',
          serial_number: newDev.serialCode || '',
          operating_system: newDev.os || '',
          status: 'active',
          created_at: newDev.createdAt
        };
        setLastAddedDevice(mappedDevice);

        // Clear states
        setNewDeviceName('');
        setNewDeviceModel('');
        setNewDeviceSN('');
        setNewDeviceBrand('Asus');
        setCustomBrand('');
        setNewDeviceOS('Windows 11');
        setCustomOS('');
        setNewDeviceType('laptop');
        setCustomType('');
        setAttachedImages([]);
        setAttachedVideo('');
        setCustomFields([]);

        await refreshData();
        setDeviceAdding(false);
        setShowAddDeviceModal(false);
        setShowDeviceSuccessModal(true);
        showToast('Device registered successfully!', 'success');
      } catch (err: any) {
        setDeviceAdding(false);
        console.error('API add device failed:', err);
        showToast('Device registration failed', 'error');
      }
    }
  };

  // Service options filtered by plan tier
  const getSelectableRequestServices = () => {
    const activePlan = plans.find(p => p.id === subscription?.plan_id) || plans.find(p => p.type === activePlanType);
    if (activePlan && activePlan.benefits && activePlan.benefits.length > 0) {
      return activePlan.benefits.map((b: string) => ({ value: b, label: b }));
    }

    // fallback
    return [
      { value: 'software', label: 'Software Installation & Setup' },
      { value: 'diagnostic', label: 'Hardware Fault Diagnosis' },
      { value: 'other', label: 'Repair Coordination & Assistance' }
    ];
  };

  const handleMakeRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle || !reqDesc) {
      alert('Please fill out all details.');
      return;
    }

    if (subscription?.status === 'suspended') {
      alert('Your subscription is suspended. Service requests are currently locked.');
      return;
    }

    const isHardwareOrSoftware = !reqCategory.includes('website');
    if (isHardwareOrSoftware && !reqDeviceId) {
      alert('Please select the registered device for this repair / update.');
      return;
    }

    const websiteDetails = ['website_portfolio', 'website_business'].includes(reqCategory) ? {
      business_name: webBusinessName || `${profile?.full_name}'s Site`,
      subdomain: webSubdomain || `${profile?.full_name?.toLowerCase().replace(/\s+/g, '')}.studentshield.com`,
      description: webDescription,
      pages_count: reqCategory === 'website_business' ? webPagesCount : 1,
      hosting_required: webHosting
    } : undefined;

    const urgencyMap: Record<string, string> = {
      low: 'LOW',
      medium: 'MEDIUM',
      high: 'HIGH',
      urgent: 'CRITICAL'
    };
    const backendUrgency = (urgencyMap[reqPriority] || 'LOW') as any;

    setRequestSubmitting(true);
    try {
      const res = await requestService.createRequest({
        type: reqCategory,
        title: reqTitle,
        description: reqDesc,
        urgency: backendUrgency,
        businessName: websiteDetails?.business_name,
        desiredSubdomain: websiteDetails?.subdomain,
        websiteConceptDescription: websiteDetails?.description,
        websitePageCount: websiteDetails?.pages_count,
        preferHosting: websiteDetails?.hosting_required,
      }, isHardwareOrSoftware ? reqDeviceId : undefined);

      const reqObj = res.data;
      const mappedRequest: SupportTicket = {
        id: reqObj.id,
        user_id: reqObj.subscriberId,
        device_id: reqObj.deviceId,
        title: reqObj.title,
        description: reqObj.description,
        category: reqObj.type as any,
        priority: reqObj.urgency === 'CRITICAL' ? 'urgent' : reqObj.urgency.toLowerCase() as any,
        status: reqObj.status.toLowerCase() as any,
        created_at: reqObj.createdAt,
        updated_at: reqObj.updatedAt,
        receipt_pdf: reqObj.receipt,
        tracking_qr: reqObj.qrCode || res.qrCode?.data
      };

      // Clear forms
      setReqTitle('');
      setReqDesc('');
      setReqDeviceId('');
      setWebBusinessName('');
      setWebSubdomain('');
      setWebDescription('');

      // Auto-show receipt
      setRequestSubmitting(false);
      setShowAddRequestModal(false);
      setSelectedRequestForReceipt(mappedRequest);
      setActiveTab('dashboard');
      await refreshData();
      showToast('Support request submitted successfully!', 'success');

    } catch (err: any) {
      setRequestSubmitting(false);
      console.error('API make request failed:', err);
      showToast(err.message || 'Failed to submit support request', 'error');
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTicket && newMsgContent.trim()) {
      showToast('Messaging coming soon', 'info');
      setNewMsgContent('');
    }
  };

  // Determistic student credentials based on mock
  const userEmail = user?.email || '';
  const personalWebUrl = `https://${profile?.full_name?.toLowerCase().replace(/\s+/g, '') || 'portfolio'}.studentshield.net`;
  const websiteAdminDashboardUrl = `https://wp-admin.studentshield.net/auth?user=${encodeURIComponent(userEmail)}`;

  // Filter values
  const filteredTickets = tickets.filter(t => {
    if (!searchValue.trim()) return true;
    const q = searchValue.toLowerCase();
    return (t.title || '').toLowerCase().includes(q) || 
           (t.description || '').toLowerCase().includes(q) || 
           (t.id || '').toLowerCase().includes(q);
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-150';
      case 'in_progress':
      case 'under_repair':
        return 'text-amber-700 bg-amber-50 border border-amber-150';
      default:
        return 'text-royal bg-blue-50 border border-blue-150';
    }
  };

  const planPrice = isBonanza ? '120' : (isPremium ? '50' : '20');
  const planName = isBonanza ? 'Bonanza Plan' : (isPremium ? 'Premium Shield' : 'Basic Cover');

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans select-none text-left antialiased relative">
      
      {/* 1. Left Sidebar Section - Desktop */}
      <aside className="hidden md:flex w-64 bg-navy text-white flex flex-col justify-between border-r border-slate-800 shrink-0 sticky top-0 h-screen select-none z-30">
        <div className="p-6">
          <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
            <div className="w-8 h-8 bg-royal rounded-lg flex items-center justify-center text-white">
              <Shield className="w-5 h-5 flex-shrink-0" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight block">StudentShield</span>
              <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Student Portal</span>
            </div>
          </div>

          <nav className="mt-8 space-y-2.5">
            <button 
              onClick={() => { setActiveTab('dashboard'); setSelectedTicket(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Cpu className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>

            <button 
              onClick={() => { setActiveTab('devices'); setSelectedTicket(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'devices' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Laptop className="w-4 h-4" />
              <span>Devices</span>
              <span className="ml-auto bg-slate-800 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-slate-350">{currentDevicesCount}/{maxDevicesAllowed}</span>
            </button>

            <button 
              onClick={() => { setActiveTab('make_request'); setSelectedTicket(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'make_request' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Sliders className="w-4 h-4" />
              <span>Requests</span>
            </button>

            <button 
              onClick={() => { setActiveTab('history'); setSelectedTicket(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'history' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <History className="w-4 h-4" />
              <span>History & Receipts</span>
            </button>

            <button 
              onClick={() => { setActiveTab('notifications'); setSelectedTicket(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'notifications' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="ml-auto bg-amber-500 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-semibold font-mono">
                  {notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </button>

            <button 
              onClick={() => { setActiveTab('profile'); setSelectedTicket(null); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 space-y-3">
          <div className="bg-slate-900/55 p-3 rounded-xl border border-slate-850 flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800">
              <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-bold block truncate text-slate-200">{profile?.full_name}</span>
              <span className={`text-[9px] block font-semibold truncate capitalize ${subscription?.status === 'expired' ? 'text-amber-400' : subscription?.status === 'suspended' ? 'text-rose-400' : 'text-royal'}`}>
                {planName} {subscription?.status === 'expired' ? '(Expired)' : subscription?.status === 'suspended' ? '(Suspended)' : ''}
              </span>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full py-2 bg-red-655/15 hover:bg-red-655/25 text-red-400 border border-red-500/10 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[40] md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Navigation Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-navy text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 z-[45] md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-royal rounded-lg flex items-center justify-center text-white">
                <Shield className="w-5 h-5 flex-shrink-0" />
              </div>
              <div>
                <span className="font-semibold text-sm tracking-tight block">StudentShield</span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Student Portal</span>
              </div>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-8 space-y-2.5">
            <button 
              onClick={() => { setActiveTab('dashboard'); setSelectedTicket(null); setMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Cpu className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>

            <button 
              onClick={() => { setActiveTab('devices'); setSelectedTicket(null); setMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'devices' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Laptop className="w-4 h-4" />
              <span>Devices</span>
              <span className="ml-auto bg-slate-800 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold text-slate-350">{currentDevicesCount}/{maxDevicesAllowed}</span>
            </button>

            <button 
              onClick={() => { setActiveTab('make_request'); setSelectedTicket(null); setMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'make_request' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Sliders className="w-4 h-4" />
              <span>Requests</span>
            </button>

            <button 
              onClick={() => { setActiveTab('history'); setSelectedTicket(null); setMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'history' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <History className="w-4 h-4" />
              <span>History & Receipts</span>
            </button>

            <button 
              onClick={() => { setActiveTab('notifications'); setSelectedTicket(null); setMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'notifications' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="ml-auto bg-amber-500 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-semibold font-mono">
                  {notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </button>

            <button 
              onClick={() => { setActiveTab('profile'); setSelectedTicket(null); setMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-3 transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-royal text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 space-y-3">
          <div className="bg-slate-900/55 p-3 rounded-xl border border-slate-850 flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800">
              <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-bold block truncate text-slate-200">{profile?.full_name}</span>
              <span className={`text-[9px] block font-semibold truncate capitalize ${subscription?.status === 'expired' ? 'text-amber-400' : subscription?.status === 'suspended' ? 'text-rose-400' : 'text-royal'}`}>
                {planName} {subscription?.status === 'expired' ? '(Expired)' : subscription?.status === 'suspended' ? '(Suspended)' : ''}
              </span>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full py-2 bg-red-655/15 hover:bg-red-655/25 text-red-400 border border-red-500/10 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Frame */}
      <main className="flex-grow flex flex-col justify-between overflow-y-auto h-screen w-full relative">
        <header className="h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-655 border border-slate-200 rounded-lg md:hidden cursor-pointer mr-2.5"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">WORKSPACE</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-navy font-bold uppercase tracking-wider capitalize">{activeTab.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center relative">
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search requests, devices..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="mr-2 text-xs px-3 py-1.5 border border-slate-200 bg-slate-50/50 rounded-lg text-slate-800 focus:outline-none focus:border-royal transition-all font-sans"
                  />
                )}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-8 h-8 bg-slate-50 hover:bg-slate-100 text-slate-655 rounded-full border border-slate-200/50 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification alert dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="w-8 h-8 bg-slate-50 hover:bg-slate-100 text-slate-655 rounded-full border border-slate-200/50 flex items-center justify-center cursor-pointer transition-colors relative"
              >
                <Bell className="w-3.5 h-3.5" />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-white" />
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-xs p-4 space-y-2.5"
                  >
                    <div className="font-semibold text-navy uppercase text-[9px] tracking-wider border-b border-slate-100 pb-1.5 flex justify-between items-center">
                      <span>Recent Alerts</span>
                      <button onClick={() => setNotifDropdownOpen(false)} className="text-slate-400 hover:text-navy font-bold">Close</button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div key={notif.id} className="border-b border-slate-50 pb-2 last:border-0">
                            <p className="font-bold text-slate-800 text-[10px]">{notif.title}</p>
                            <p className="text-slate-500 text-[9px] mt-0.5">{notif.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-center py-4 font-mono text-[9px]">No triage updates.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Frame Content */}
        <div className="p-8 flex-grow">

          {/* Active plan banner state warning */}
          {subscription?.status === 'suspended' && (
            <div className="mb-6 p-4.5 bg-rose-50 border border-rose-250 text-rose-800 rounded-2xl flex items-start space-x-3.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs">Academic Insure Plan Suspended</h4>
                <p className="text-[10px] text-rose-700 mt-0.5 font-medium">
                  Your student subscription has been suspended by the administrator (typically triggered at the end of the academic semester). Make request actions and tech support diagnostics are temporarily locked. Please contact Booth technicians.
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Header greeting */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-navy tracking-tight">Welcome back, {profile?.full_name} 👋</h2>
                  <p className="text-xs text-slate-400 font-semibold font-sans mt-0.5">
                    {profile?.residence || profile?.university} • Student ID: {profile?.student_id} • Semester 2
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[9px] uppercase tracking-wider text-slate-450 font-semibold font-mono">PLAN LEVEL:</span>
                  <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase border ${
                    subscription?.status === 'suspended' 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : subscription?.status === 'expired'
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-250'
                  }`}>
                    {planName} ({subscription?.status === 'suspended' ? 'Suspended' : subscription?.status === 'expired' ? 'Expired' : 'Active'})
                  </span>
                  {subscription?.status === 'expired' && (
                    <button
                      onClick={handleRenewPlan}
                      disabled={isRenewing}
                      className="ml-2 bg-royal hover:bg-royal/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-sm shadow-royal/20 transition-colors"
                    >
                      {isRenewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Renew Plan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bento analytics stats blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex flex-col justify-between hover:border-royal/20 transition-all select-none">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-royal tracking-wide block">PLAN COVER</span>

                  </div>
                  <div>
                    <span className="text-xl font-bold text-navy mt-1 tracking-tight flex items-center space-x-2 capitalize">
                      <span>{planName}</span>
                      {subscription?.status === 'expired' && <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Expired</span>}
                      {subscription?.status === 'suspended' && <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Suspended</span>}
                    </span>
                    <span className="text-[10px] text-slate-450 block mt-1.5 font-semibold">GH₵ {planPrice} Paid</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex flex-col justify-between hover:border-royal/20 transition-all select-none">
                  <span className="text-[10px] uppercase font-bold text-royal tracking-wide block">DEVICES ADDED</span>
                  <span className="text-xl font-bold text-navy mt-1 tracking-tight block">{currentDevicesCount} / {maxDevicesAllowed}</span>
                  <span className="text-[10px] text-slate-455 block mt-1.5 font-semibold">Allocated devices count</span>
                </div>

                <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex flex-col justify-between hover:border-royal/20 transition-all select-none">
                  <span className="text-[10px] uppercase font-bold text-royal tracking-wide block">TREATMENT REPAIRS</span>
                  <span className="text-xl font-bold text-emerald-600 mt-1 tracking-tight block">
                    {filteredTickets.filter(t => t.status === 'resolved').length} Resolved
                  </span>
                  <span className="text-[10px] text-slate-450 block mt-1.5 font-semibold">
                    {filteredTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length} in triage queue
                  </span>
                </div>

                <div className="bg-white border border-slate-200/70 p-5 rounded-2xl flex flex-col justify-between hover:border-royal/20 transition-all select-none">
                  <span className="text-[10px] uppercase font-bold text-royal tracking-wide block">SAVINGS CALCULATOR</span>
                  <span className="text-xl font-bold text-[#D97706] mt-1 tracking-tight block">
                    GH₵ {isBonanza ? '580.00' : (isPremium ? '320.00' : '80.00')}
                  </span>
                  <span className="text-[10px] text-slate-450 block mt-1.5 font-semibold">vs. external service costs</span>
                </div>
              </div>

              {/* Website Credentials Block for Premium/Bonanza Web Hosting commented out */}
              {/* {(isPremium || isBonanza) && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <Smartphone className="w-5 h-5 text-royal" />
                    <div>
                      <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Plan Website Credentials</h3>
                      <p className="text-[10px] text-slate-400">Mock hosting portal generated under your {planName} tier.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Personal Portfolio Address</span>
                      <a href={personalWebUrl} target="_blank" rel="noreferrer" className="text-royal font-bold font-mono text-[11.5px] hover:underline block break-all">
                        {personalWebUrl}
                      </a>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase inline-block">Online</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Web Design Dashboard Login</span>
                      <div className="space-y-1 text-[10.5px]">
                        <p><span className="font-semibold text-slate-500">Username:</span> <span className="font-mono font-bold text-navy">{user?.email}</span></p>
                        <p><span className="font-semibold text-slate-500">Password:</span> <span className="font-mono font-bold text-navy">SS-WebUser-{profile?.student_id.slice(-4)}!</span></p>
                      </div>
                      <a href={websiteAdminDashboardUrl} target="_blank" rel="noreferrer" className="text-royal font-bold text-[10px] hover:underline inline-block mt-1 font-mono">
                        Access Admin Console →
                      </a>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Split layout: Registered Devices Grid & Active Request History */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Registered Devices Modern UI/UX layout */}
                <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Registered Workspace Devices</h4>
                    <button 
                      onClick={() => setActiveTab('devices')}
                      className="text-[10px] font-bold text-royal hover:underline uppercase"
                    >
                      + Add New
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {devices.map(dev => {
                      const hasImages = dev.device_images && dev.device_images.length > 0;
                      const hasVideo = dev.video_url;
                      return (
                        <div key={dev.id} className="border border-slate-200 bg-slate-50/20 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
                          
                          {/* Animated Image Preview Container */}
                          <div className="h-32 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                            {hasImages ? (
                              <motion.img 
                                src={dev.device_images?.[0]} 
                                alt={dev.name} 
                                className="w-full h-full object-cover select-none"
                                whileHover={{ scale: 1.08 }}
                                transition={{ type: 'tween', duration: 0.3 }}
                              />
                            ) : (
                              <motion.img 
                                src={dev.image_url} 
                                alt={dev.name} 
                                className="w-full h-full object-cover select-none"
                                whileHover={{ scale: 1.08 }}
                                transition={{ type: 'tween', duration: 0.3 }}
                              />
                            )}

                            {/* Video Play Indicator */}
                            {hasVideo && (
                              <button
                                onClick={() => setActiveVideoUrl(dev.video_url || null)}
                                className="absolute inset-0 m-auto w-10 h-10 bg-navy/80 hover:bg-royal text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-lg"
                                title="Play uploaded video specs"
                              >
                                <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                              </button>
                            )}

                            <span className="absolute top-2 right-2 text-[8px] uppercase tracking-widest font-mono font-bold text-white bg-slate-900/60 backdrop-blur px-2 py-0.5 rounded">
                              {dev.type}
                            </span>
                          </div>

                          {/* Details Metadata */}
                          <div className="p-4 space-y-2 text-left text-xs">
                            <div>
                              <span className="font-semibold text-navy block truncate text-[12px]">{dev.name}</span>
                              <span className="text-[9px] text-slate-400 font-mono block mt-0.5">Device ID: {dev.id}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] border-t border-slate-100 pt-2 text-slate-500 font-medium">
                              <p><span className="text-slate-400 block text-[8.5px]">BRAND</span> {dev.brand}</p>
                              <p><span className="text-slate-400 block text-[8.5px]">MODEL</span> {dev.model}</p>
                              <p className="col-span-2 mt-1"><span className="text-slate-400 block text-[8.5px]">OS INSTALLED</span> {dev.operating_system}</p>
                              <p className="col-span-2"><span className="text-slate-400 block text-[8.5px]">SERIAL CODE</span> <span className="font-mono text-[9px] select-all font-bold text-slate-700">{dev.serial_number}</span></p>
                            </div>

                            {/* Render custom fields if present */}
                            {dev.custom_fields && dev.custom_fields.length > 0 && (
                              <div className="border-t border-slate-100 pt-2 space-y-1 text-[9.5px]">
                                <span className="text-royal font-mono text-[8px] font-semibold block uppercase tracking-wider">Custom attributes</span>
                                {dev.custom_fields.map((f, i) => (
                                  <p key={i} className="text-slate-600"><span className="font-bold text-slate-450">{f.label}:</span> {f.value}</p>
                                ))}
                              </div>
                            )}

                            <div className="pt-2 flex justify-between items-center border-t border-slate-100/60 mt-1">
                              <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">
                                {dev.status}
                              </span>
                              
                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(dev);
                                  }}
                                  className="p-1 text-slate-400 hover:text-royal hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  title="Edit device specifications"
                                >
                                  <Sliders className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingDevice(dev);
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  title="Delete/deregister device"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                    {devices.length === 0 && (
                      <div className="col-span-2 text-center py-10 text-slate-400 text-xs">No registered academic devices. Please register one to engage coverage.</div>
                    )}
                  </div>
                </div>

                {/* Repair History / Requests */}
                <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 w-full">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3">Service Diagnostic Requests</h4>
                  
                  <div className="space-y-3">
                    {filteredTickets.map(ticket => (
                      <div 
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-4 bg-slate-50/40 hover:bg-slate-50 hover:border-royal/30 border border-slate-200/70 rounded-xl flex justify-between items-center transition-all cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[9px] text-slate-400">REQ #{ticket.id}</span>
                            <span className="bg-royal/5 border border-royal/10 text-royal text-[8.5px] px-1.5 py-0.1 font-bold rounded">
                              {ticket.category.toUpperCase().replace('_', ' ')}
                            </span>
                          </div>
                          <h5 className="font-bold text-navy text-xs tracking-tight line-clamp-1">{ticket.title}</h5>
                          <span className="text-[9px] text-slate-400 block">
                            Requested: {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3.5 border-l border-slate-200 pl-4 shrink-0">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${getStatusBadgeClass(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-405" />
                        </div>
                      </div>
                    ))}
                    {filteredTickets.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-xs font-mono">No requests in pipeline history.</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DEVICES CATALOG */}
          {activeTab === 'devices' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-navy uppercase tracking-tight">Enrolled Devices</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-semibold font-sans">
                    Your active coverage allows up to {maxDevicesAllowed} device(s) (Currently using {currentDevicesCount}).
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDeviceModal(true)}
                  disabled={currentDevicesCount >= maxDevicesAllowed}
                  className="px-4 py-2.5 bg-royal hover:bg-royal/90 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5 shadow-md shadow-royal/10 border-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Device</span>
                </button>
              </div>

              {devices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {devices.map(dev => {
                    const hasImages = dev.device_images && dev.device_images.length > 0;
                    const hasVideo = dev.video_url;
                    return (
                      <div key={dev.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group">
                        
                        {/* Animated Image Preview Container */}
                        <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                          {hasImages ? (
                            <motion.img 
                              src={dev.device_images?.[0]} 
                              alt={dev.name} 
                              className="w-full h-full object-cover select-none"
                              whileHover={{ scale: 1.08 }}
                              transition={{ type: 'tween', duration: 0.3 }}
                            />
                          ) : (
                            <motion.img 
                              src={dev.image_url} 
                              alt={dev.name} 
                              className="w-full h-full object-cover select-none"
                              whileHover={{ scale: 1.08 }}
                              transition={{ type: 'tween', duration: 0.3 }}
                            />
                          )}

                          {hasVideo && (
                            <button
                              onClick={() => setActiveVideoUrl(dev.video_url || null)}
                              className="absolute inset-0 m-auto w-10 h-10 bg-navy/80 hover:bg-royal text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-lg"
                              title="Play uploaded video specs"
                            >
                              <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                            </button>
                          )}

                          <span className="absolute top-3 right-3 text-[8px] uppercase tracking-widest font-mono font-bold text-white bg-slate-900/60 backdrop-blur px-2.5 py-0.5 rounded-full">
                            {dev.type}
                          </span>
                        </div>

                        {/* Details Metadata */}
                        <div className="p-5 space-y-3.5 text-left text-xs flex-grow flex flex-col justify-between">
                          <div className="space-y-2">
                            <div>
                              <span className="font-semibold text-navy block truncate text-[13px]">{dev.name}</span>
                              <span className="text-[9px] text-slate-400 font-mono block mt-0.5">Device ID: {dev.id}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] border-t border-slate-100 pt-2.5 text-slate-500 font-medium font-sans">
                              <p><span className="text-slate-400 block text-[8px] font-mono">BRAND</span> {dev.brand}</p>
                              <p><span className="text-slate-400 block text-[8px] font-mono">MODEL</span> {dev.model}</p>
                              <p className="col-span-2 mt-0.5"><span className="text-slate-400 block text-[8px] font-mono">OS INSTALLED</span> {dev.operating_system}</p>
                              <p className="col-span-2"><span className="text-slate-400 block text-[8px] font-mono">SERIAL CODE</span> <span className="font-mono text-[9.5px] select-all font-bold text-slate-700">{dev.serial_number}</span></p>
                            </div>

                            {dev.custom_fields && dev.custom_fields.length > 0 && (
                              <div className="border-t border-slate-100 pt-2.5 space-y-1 text-[9.5px]">
                                <span className="text-royal font-mono text-[8px] font-semibold block uppercase tracking-wider">Custom attributes</span>
                                {dev.custom_fields.map((f, i) => (
                                  <p key={i} className="text-slate-600"><span className="font-bold text-slate-450">{f.label}:</span> {f.value}</p>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="pt-3.5 flex justify-between items-center border-t border-slate-100">
                            <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">
                              {dev.status}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditModal(dev);
                                }}
                                className="p-1.5 text-slate-400 hover:text-royal hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                                title="Edit device specifications"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingDevice(dev);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                                title="Delete/deregister device"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center space-y-3">
                  <Laptop className="w-12 h-12 text-slate-300 mx-auto animate-bounce" />
                  <h4 className="font-bold text-navy text-sm uppercase tracking-wide">No Registered Devices</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-semibold">
                    You haven't registered any devices for campus coverage yet. Register your device now to log diagnostics.
                  </p>
                  <button
                    onClick={() => setShowAddDeviceModal(true)}
                    className="py-2.5 px-4 bg-royal hover:bg-royal/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border-0"
                  >
                    + Register Device Now
                  </button>
                </div>
              )}
            </div>
          )}

           {/* TAB 3: SERVICE REQUESTS LIST */}
          {activeTab === 'make_request' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-navy uppercase tracking-tight">Technical Service Requests</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-semibold font-sans">
                    Submit and track active diagnostic repairs with campus Booth technicians.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const opts = getSelectableRequestServices();
                    if (opts.length > 0) setReqCategory(opts[0].value as any);
                    setShowAddRequestModal(true);
                  }}
                  disabled={subscription?.status === 'suspended' || subscription?.status === 'expired'}
                  className="px-4 py-2.5 bg-royal hover:bg-royal/90 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5 shadow-md shadow-royal/10 border-0"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Submit Request</span>
                </button>
              </div>

              {tickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tickets.map(ticket => (
                    <div 
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="bg-white border border-slate-200 hover:border-royal/30 p-5 rounded-3xl flex flex-col justify-between items-start transition-all cursor-pointer hover:shadow-md text-left space-y-4"
                    >
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9.5px] text-slate-400">REQ #{ticket.id}</span>
                          <span className="bg-royal/5 border border-royal/10 text-royal text-[9px] px-2 py-0.5 font-bold rounded-full uppercase">
                            {ticket.category.toUpperCase().replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-navy text-[13px] leading-tight block line-clamp-1">{ticket.title}</h4>
                        <p className="text-[11.5px] text-slate-550 leading-relaxed line-clamp-2">{ticket.description}</p>
                        <span className="text-[9.5px] text-slate-400 block mt-1.5 font-sans font-medium">
                          Submitted: {new Date(ticket.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between w-full border-t border-slate-100 pt-3">
                        <span className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded uppercase ${getStatusBadgeClass(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-royal uppercase tracking-wider">
                          <span>View Logs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center space-y-3">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-navy text-sm uppercase tracking-wide">No Service Requests</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-semibold">
                    You haven't submitted any diagnostics request tickets yet. Submit one if your device experiences system crashes.
                  </p>
                  <button
                    onClick={() => {
                      const opts = getSelectableRequestServices();
                      if (opts.length > 0) setReqCategory(opts[0].value as any);
                      setShowAddRequestModal(true);
                    }}
                    disabled={subscription?.status === 'suspended'}
                    className="py-2.5 px-4 bg-royal hover:bg-royal/90 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-royal/10 border-0"
                  >
                    + Submit Request Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Profile details and updating coordinates */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3">My Profile Details</h3>

                <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 text-xs font-sans">
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-5 border-b border-slate-100">
                    <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                      <img 
                        src={editAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(editName || 'User')}`} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer select-none text-[8.5px] uppercase font-bold tracking-wider space-y-1">
                        <Camera className="w-4 h-4" />
                        <span>Change</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarFileChange} 
                        />
                      </label>
                    </div>
                    <div className="text-center sm:text-left space-y-1.5 flex-grow">
                      <h4 className="font-bold text-navy text-xs uppercase tracking-wide">Profile Photo</h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-xs">
                        Upload a JPEG or PNG image (max 2MB), or generate one below.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => setEditAvatar(`https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.random().toString(36).substring(2, 9)}`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold uppercase tracking-wider rounded border-0 cursor-pointer"
                        >
                          Pixel Art
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substring(2, 9)}`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold uppercase tracking-wider rounded border-0 cursor-pointer"
                        >
                          Robot
                        </button>
                        {editAvatar && (
                          <button
                            type="button"
                            onClick={() => setEditAvatar('')}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[9px] font-bold uppercase tracking-wider rounded border-0 cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Account Email Address</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-[10.5px] text-slate-500 select-all">
                      {user?.email}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Full Legal Name</label>
                      <input 
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-royal focus:bg-white text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">MoMo Contact Mobile</label>
                      <input 
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-royal focus:bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Residence (Hall / Hostel)</label>
                    <input 
                      type="text"
                      required
                      value={editUni}
                      onChange={(e) => setEditUni(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-royal focus:bg-white text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileUpdating}
                    className="w-full flex justify-center items-center gap-2 py-3 bg-navy hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {profileUpdating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : profileSaved ? (
                      'Updates Logged successfully ✓'
                    ) : (
                      'Save profile changes'
                    )}
                  </button>
                </form>
              </div>

              {/* Plans Upgrade panel */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Change Protection Plan</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Upgrade or downgrade your semester diagnostics cover.</p>
                </div>

                 <div className="space-y-4">
                  {plans.map((p) => {
                    const isCurrent = subscription?.plan_id === p.id || activePlanType === p.type;
                    const isBonanzaPlan = p.type === 'BONANZA';
                    return (
                      <div key={p.id} className={`p-4 border rounded-2xl text-xs space-y-2 transition-all ${isCurrent ? isBonanzaPlan ? 'border-amber-500 bg-amber-50/10' : 'border-royal bg-blue-50/20' : 'border-slate-200 bg-white'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold block text-[12px] ${isBonanzaPlan ? 'text-amber-900' : 'text-navy'}`}>{p.type.charAt(0) + p.type.slice(1).toLowerCase()} Plan {isBonanzaPlan ? '🚀' : p.type === 'PREMIUM' ? '⭐️' : ''}</span>
                          <span className={`font-mono font-bold ${isBonanzaPlan ? 'text-amber-600' : 'text-royal'}`}>GH₵{p.fee}/sem</span>
                        </div>
                        <p className={`text-[10px] leading-normal font-medium ${isBonanzaPlan ? 'text-amber-800' : 'text-slate-500'}`}>{p.summary || p.description}</p>
                        {(p.benefits && p.benefits.length > 0) && (
                          <ul className="space-y-1 mt-2 mb-2 text-[10px]">
                            {p.benefits.map((benefit: string, idx: number) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className={`w-1 h-1 mt-1.5 rounded-full shrink-0 ${isBonanzaPlan ? 'bg-amber-600' : 'bg-royal'}`} />
                                <span className={isBonanzaPlan ? 'text-amber-700' : 'text-slate-600'}>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {!isCurrent ? (
                          <button 
                            onClick={() => handleUpgradeDowngrade(p.id)}
                            className={`py-1.5 px-3.5 text-[10px] font-bold rounded-lg uppercase cursor-pointer ${isBonanzaPlan ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-royal hover:bg-blue-600 text-white'}`}
                          >
                            Change to {p.type.toLowerCase()}
                          </button>
                        ) : (
                          <span className={`text-[10px] font-bold uppercase tracking-wide block pt-1 ${isBonanzaPlan ? 'text-amber-600' : 'text-royal'}`}>Active coverage ✓</span>
                        )}
                      </div>
                    );
                  })}
                  
                  <p className="text-[10px] text-slate-450 text-center font-sans mt-4 leading-normal">
                    By modifying or renewing plans, you agree to our{" "}
                    <button
                      onClick={() => navigate('service-agreement')}
                      className="text-royal font-semibold hover:underline cursor-pointer"
                    >
                      Service Agreement
                    </button>
                    .
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: TRANSACTION & REQUEST HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6 text-left">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3">Past Requests & receipts</h3>
                
                <div className="space-y-3.5 text-xs font-sans">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[9px] text-slate-400">#{t.id}</span>
                          <span className="bg-royal/5 border border-royal/10 text-royal text-[8.5px] px-1.5 py-0.1 font-bold rounded">
                            {t.category.toUpperCase().replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-navy text-xs leading-none mt-1.5">{t.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{t.description}</p>
                        <span className="text-[9px] text-slate-400 font-mono block">Filed on: {new Date(t.created_at).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 border-l border-slate-200/80 pl-4 flex-wrap gap-y-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${getStatusBadgeClass(t.status)}`}>
                          {t.status}
                        </span>
                        {t.receipt_pdf && (
                          <>
                            <button
                              onClick={() => setSelectedRequestForReceipt(t)}
                              className="p-1.5 bg-white border border-slate-200 text-royal hover:bg-slate-50 rounded-lg flex items-center space-x-1 font-bold uppercase text-[9px] cursor-pointer"
                              title="View Receipt & QR Code"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>QR Code</span>
                            </button>
                            <button
                              onClick={() => {
                                const element = document.createElement("a");
                                const file = new Blob([t.receipt_pdf || ''], {type: 'text/plain'});
                                element.href = URL.createObjectURL(file);
                                element.download = `StudentShield_Receipt_${t.id}.txt`;
                                document.body.appendChild(element);
                                element.click();
                                document.body.removeChild(element);
                                showToast('Ticket receipt downloaded successfully!', 'success');
                              }}
                              className="p-1.5 bg-white border border-slate-200 text-emerald-700 hover:bg-slate-50 rounded-lg flex items-center space-x-1 font-bold uppercase text-[9px] cursor-pointer"
                              title="Download Ticket"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {tickets.length === 0 && (
                    <p className="text-slate-400 text-center py-6">No request history found.</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3">Payments & Billing Ledger</h3>
                
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="p-3">Reference ID</th>
                        <th className="p-3">Billing Plan</th>
                        <th className="p-3">Payment Method</th>
                        <th className="p-3">Amount Paid</th>
                        <th className="p-3 text-right">Confirmation Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments
                        .map((pay: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-royal">{pay.transactionRef || pay.id}</td>
                            <td className="p-3 font-medium capitalize">Semester Coverage Package</td>
                            <td className="p-3 text-slate-600">{pay.method || 'Mobile Money'}</td>
                            <td className="p-3 font-bold text-emerald-600">GH₵ {pay.amount}.00</td>
                            <td className="p-3 text-right text-slate-400 font-mono text-[10px]">{new Date(pay.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-slate-100 pb-3">Triage Notifications Alert Log</h3>

              <div className="space-y-3 font-sans text-xs">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl flex items-start space-x-3.5">
                    <div className="mt-0.5 w-6 h-6 rounded bg-royal/10 text-royal flex items-center justify-center shrink-0">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">{new Date(notif.created_at).toLocaleString()}</span>
                      <h4 className="font-bold text-navy text-xs mt-1">{notif.title}</h4>
                      <p className="text-[11.5px] text-slate-500 leading-normal mt-0.5">{notif.content}</p>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <p className="text-slate-400 text-center py-6">All systems cleared. No new alerts.</p>
                )}
              </div>
            </div>
          )}

        </div>

        <footer className="py-6 border-t border-slate-200 bg-white text-center text-[10px] text-slate-400 font-semibold font-sans tracking-wide">
          StudentShield HubHQ Legon • Secure System Client Console.
        </footer>
      </main>

      {/* Support Conversation chat pane overlay */}
      {selectedTicket && (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
          <div className="p-4.5 border-b border-slate-200/60 flex items-center justify-between">
            <div>
              <span className="text-[8.5px] uppercase font-bold text-slate-400 font-mono block">Support Case Ticket</span>
              <span className="text-xs font-bold text-navy block truncate max-w-[120px]">{selectedTicket.title}</span>
            </div>
            <button 
              onClick={() => setSelectedTicket(null)} 
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/40 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-[9px] uppercase font-bold text-royal block">Issue description</span>
              <p className="text-[11px] text-slate-605 leading-relaxed">{selectedTicket.description}</p>
              {/* website_details rendering commented out */}
              {/* {selectedTicket.website_details && (
                <div className="pt-2 border-t border-slate-100 mt-2 space-y-1 text-[9.5px]">
                  <p className="font-bold text-navy">Website Setup Specifications:</p>
                  <p><span className="text-slate-400">Business Name:</span> {selectedTicket.website_details.business_name}</p>
                  <p><span className="text-slate-455">Requested Subdomain:</span> {selectedTicket.website_details.subdomain}</p>
                  <p><span className="text-slate-455">Page Count:</span> {selectedTicket.website_details.pages_count} pages</p>
                </div>
              )} */}
            </div>

            <div className="space-y-3 font-sans">
              {chatMessages.map((msg, idx) => {
                const isStaff = msg.message.sender_role === 'admin' || msg.message.sender_role === 'support_agent';
                return (
                  <div key={idx} className={`flex items-start space-x-2 max-w-[85%] ${isStaff ? 'mr-auto text-left' : 'ml-auto text-right flex-row-reverse space-x-reverse'}`}>
                    <div className="w-5 h-5 rounded-full overflow-hidden border flex-shrink-0 bg-slate-200">
                      <img src={isStaff ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' : `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} alt="Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div className={`p-2.5 rounded-xl text-[10.5px] leading-relaxed ${isStaff ? 'bg-royal text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                      <span className="text-[8.5px] font-bold block mb-1 opacity-75 uppercase">{msg.senderName}</span>
                      <p className="whitespace-pre-line">{msg.message.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2 font-sans">
            <input
              type="text"
              required
              placeholder="Send message to Booth..."
              value={newMsgContent}
              onChange={(e) => setNewMsgContent(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-royal rounded-xl text-slate-800"
            />
            <button type="submit" className="px-4.5 bg-navy hover:bg-slate-900 text-white rounded-xl cursor-pointer text-xs font-bold uppercase font-sans">Send</button>
          </form>
        </div>
      )}

      {/* MODAL: MOCK PDF RECEIPT DISPLAY */}
      <AnimatePresence>
        {selectedRequestForReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 text-xs select-none"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-slate-355 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl text-left"
            >
              <button 
                onClick={() => setSelectedRequestForReceipt(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Printer className="w-5 h-5 text-royal" />
                  <span className="font-semibold text-sm text-navy uppercase tracking-wider font-sans">Print Request Receipt</span>
                </div>

                {/* Printable receipt content */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-750 GHS whitespace-pre-wrap select-all leading-normal max-h-96 overflow-y-auto">
                  {selectedRequestForReceipt.receipt_pdf}
                </div>

                {/* Tracking QR */}
                <div className="bg-white border border-slate-150 p-4 rounded-xl flex flex-col items-center justify-center space-y-3">
                  <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider block font-sans">Diagnostic tracking QR</span>
                  <div className="p-1 border border-slate-100 rounded-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(window.location.origin + '/request-details?id=' + selectedRequestForReceipt.id)}`}
                      alt="Tracking QR Code"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <a 
                    href={`/request-details?id=${selectedRequestForReceipt.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-bold text-[10.5px] uppercase tracking-widest text-royal hover:underline"
                  >
                    View Public Tracking Page
                  </a>
                  <p className="text-[8.5px] text-slate-400 text-center font-sans">Technicians scan this QR code on physical hub reception to route your device instantly without logging in.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center flex items-center justify-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([selectedRequestForReceipt.receipt_pdf || ''], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `StudentShield_Receipt_${selectedRequestForReceipt.id}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                      showToast('Receipt downloaded successfully!', 'success');
                    }}
                    className="py-2.5 px-4 bg-royal hover:bg-blue-655 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center flex items-center justify-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODERN React Success Modal for device creation */}
      <AnimatePresence>
        {showDeviceSuccessModal && lastAddedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4 text-xs font-sans select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-5 text-center shadow-2xl relative"
            >
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Device Registered</h3>
                <p className="text-slate-450 text-[10.5px] font-semibold leading-relaxed">
                  Your device <span className="text-navy font-bold">{lastAddedDevice.name}</span> has been securely logged to the system repository and is active under your protect plan.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5 text-left font-sans text-[10.5px]">
                <p><span className="text-slate-450 font-bold block text-[8px]">DEVICE ID GENERATED</span> <span className="font-mono font-bold text-royal select-all">{lastAddedDevice.id}</span></p>
                <p className="border-t border-slate-100 pt-1.5"><span className="text-slate-450 font-bold block text-[8px]">HARDWARE SERIAL</span> <span className="font-mono text-slate-700">{lastAddedDevice.serial_number}</span></p>
              </div>

              <button
                onClick={() => {
                  setShowDeviceSuccessModal(false);
                  setActiveTab('dashboard');
                }}
                className="w-full py-3 bg-navy hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Go to Workspace overview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Video Player Lightbox Popup */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 select-none"
            onClick={() => setActiveVideoUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-black border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full aspect-video relative flex items-center justify-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors border border-white/10 cursor-pointer z-50"
              >
                <X className="w-5 h-5" />
              </button>

              <video 
                src={activeVideoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT DEVICE SPECIFICATIONS */}
      <AnimatePresence>
        {editingDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 text-xs font-sans select-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl text-left my-8"
            >
              <button 
                onClick={() => setEditingDevice(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Sliders className="w-5 h-5 text-royal" />
                  <span className="font-semibold text-sm text-navy uppercase tracking-wider">Edit Device Specifications</span>
                </div>

                <form onSubmit={handleDeviceUpdateSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Device Nickname *</label>
                    <input
                      type="text"
                      required
                      value={editDevName}
                      onChange={(e) => setEditDevName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Hardware Type *</label>
                      <select
                        value={editDevType}
                        onChange={(e) => setEditDevType(e.target.value)}
                        className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none"
                      >
                        <option value="laptop">Laptop</option>
                        <option value="desktop">Desktop</option>
                        <option value="tablet">Tablet</option>
                        <option value="phone">Smartphone</option>
                        <option value="other">Other (Specify below)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Laptop Brand *</label>
                      <select
                        value={editDevBrand}
                        onChange={(e) => setEditDevBrand(e.target.value)}
                        className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none"
                      >
                        <option value="Asus">Asus</option>
                        <option value="Apple">Apple</option>
                        <option value="HP">HP</option>
                        <option value="Dell">Dell</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Acer">Acer</option>
                        <option value="other">Other (Specify below)</option>
                      </select>
                    </div>
                  </div>

                  {(editDevType === 'other' || editDevBrand === 'other') && (
                    <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                      {editDevType === 'other' && (
                        <div className="space-y-1.5 col-span-1">
                          <label className="text-[9px] uppercase font-semibold text-royal font-mono">Custom Device Type *</label>
                          <input
                            type="text"
                            required
                            value={editCustomType}
                            onChange={(e) => setEditCustomType(e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-200 bg-white rounded-lg"
                          />
                        </div>
                      )}

                      {editDevBrand === 'other' && (
                        <div className="space-y-1.5 col-span-1">
                          <label className="text-[9px] uppercase font-semibold text-royal font-mono">Custom Brand *</label>
                          <input
                            type="text"
                            required
                            value={editCustomBrand}
                            onChange={(e) => setEditCustomBrand(e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-200 bg-white rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Model Code *</label>
                      <input
                        type="text"
                        required
                        value={editDevModel}
                        onChange={(e) => setEditDevModel(e.target.value)}
                        className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Operating System *</label>
                      <select
                        value={editDevOS}
                        onChange={(e) => setEditDevOS(e.target.value)}
                        className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none"
                      >
                        <option value="Windows 11">Windows 11</option>
                        <option value="Windows 10">Windows 10</option>
                        <option value="macOS Sequoia">macOS Sequoia</option>
                        <option value="Linux Ubuntu">Linux Ubuntu</option>
                        <option value="Android OS">Android OS</option>
                        <option value="iOS Standard">iOS Standard</option>
                        <option value="other">Other (Specify below)</option>
                      </select>
                    </div>
                  </div>

                  {editDevOS === 'other' && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <label className="text-[9px] uppercase font-semibold text-royal font-mono">Custom Operating System *</label>
                      <input
                        type="text"
                        required
                        value={editCustomOS}
                        onChange={(e) => setEditCustomOS(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 border border-slate-200 bg-white rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Hardware Serial Code / IMEI *</label>
                    <input
                      type="text"
                      required
                      value={editDevSN}
                      onChange={(e) => setEditDevSN(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-slate-50/50 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Media attachments */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <span className="text-[10px] uppercase font-semibold text-navy font-mono block">Edit Media Attachments</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Add Images</span>
                        <input type="file" multiple accept="image/*" onChange={handleEditImageUploadChange} className="w-full text-[10px] text-slate-500" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Replace Video</span>
                        <input type="file" accept="video/*" onChange={handleEditVideoUploadChange} className="w-full text-[10px] text-slate-500" />
                      </div>
                    </div>
                    {editAttachedImages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editAttachedImages.map((src, i) => (
                          <div key={i} className="w-10 h-10 rounded border border-slate-200 overflow-hidden relative group">
                            <img src={src} className="w-full h-full object-cover" alt="preview" />
                            <button type="button" onClick={() => {
                              setEditAttachedImages(editAttachedImages.filter((_, idx) => idx !== i));
                              setEditAttachedImageFiles(editAttachedImageFiles.filter((_, idx) => idx !== i));
                            }} className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingDevice(null)}
                      className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-805 rounded-xl font-bold uppercase cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={deviceUpdating}
                      className="py-3 flex justify-center items-center gap-2 bg-navy hover:bg-slate-900 text-white rounded-xl font-bold uppercase cursor-pointer text-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {deviceUpdating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Save changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: DELETE DEVICE CONFIRMATION */}
      <AnimatePresence>
        {deletingDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 text-xs font-sans select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-5 text-center shadow-2xl relative text-left"
            >
              <div className="w-14 h-14 bg-red-50 border border-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 text-center">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Deregister Device?</h3>
                <p className="text-slate-500 text-[10.5px] leading-relaxed font-semibold">
                  Are you sure you want to remove <span className="text-navy font-bold">{deletingDevice.name}</span>? This action is permanent and will suspend all active diagnostics and logs for this device ID.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeletingDevice(null)}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-805 rounded-xl font-bold uppercase cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeviceDeleteSubmit}
                  disabled={deviceDeleting}
                  className="py-2.5 flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold uppercase cursor-pointer text-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {deviceDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Deregister'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD DEVICE FORM */}
      <AnimatePresence>
        {showAddDeviceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 text-xs font-sans select-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl text-left my-8"
            >
              <button 
                onClick={() => setShowAddDeviceModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-royal/10 text-royal rounded-xl flex items-center justify-center mx-auto">
                  <Laptop className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-navy uppercase tracking-tight">Register Academic Device</h2>
                <p className="text-[11px] text-slate-550 max-w-sm mx-auto font-medium">
                  Enroll devices to diagnostic logs. Your plan limit is {maxDevicesAllowed} device(s) (Currently using {currentDevicesCount}).
                </p>
              </div>

              {deviceError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-[10.5px] rounded-xl flex items-start space-x-2 my-3">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{deviceError}</span>
                </div>
              )}

              <form onSubmit={handleDeviceRegisterSubmit} className="space-y-4 text-xs text-left mt-4">
                
                {/* Brand Logo & Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Device Nickname *</label>
                  <input
                    type="text"
                    required
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="E.g. Ama's Study Laptop, HP ZBook"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-250 bg-slate-50/50 rounded-xl focus:bg-white focus:outline-none focus:border-royal transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Select Dropdown with "Other" Option */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Hardware Type *</label>
                    <select
                      value={newDeviceType}
                      onChange={(e) => setNewDeviceType(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none focus:border-royal appearance-none cursor-pointer"
                    >
                      <option value="laptop">Laptop</option>
                      <option value="desktop">Desktop</option>
                      <option value="tablet">Tablet</option>
                      <option value="phone">Smartphone</option>
                      <option value="other">Other (Specify below)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Laptop Brand *</label>
                    <select
                      value={newDeviceBrand}
                      onChange={(e) => setNewDeviceBrand(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-250 bg-white rounded-xl focus:outline-none"
                    >
                      <option value="Asus">Asus</option>
                      <option value="Apple">Apple</option>
                      <option value="HP">HP</option>
                      <option value="Dell">Dell</option>
                      <option value="Lenovo">Lenovo</option>
                      <option value="Acer">Acer</option>
                      <option value="other">Other (Specify below)</option>
                    </select>
                  </div>
                </div>

                {/* Custom Brand or Type textboxes if "Other" is selected */}
                {(newDeviceType === 'other' || newDeviceBrand === 'other') && (
                  <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    {newDeviceType === 'other' && (
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-[9px] uppercase font-semibold text-royal font-mono">Custom Device Type *</label>
                        <input
                          type="text"
                          required
                          value={customType}
                          onChange={(e) => setCustomType(e.target.value)}
                          placeholder="e.g. Smart Watch, Raspberry Pi"
                          className="w-full text-xs px-3 py-2 border border-slate-200 bg-white rounded-lg"
                        />
                      </div>
                    )}

                    {newDeviceBrand === 'other' && (
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-[9px] uppercase font-semibold text-royal font-mono">Custom Brand *</label>
                        <input
                          type="text"
                          required
                          value={customBrand}
                          onChange={(e) => setCustomBrand(e.target.value)}
                          placeholder="e.g. Samsung, Custom PC"
                          className="w-full text-xs px-3 py-2 border border-slate-200 bg-white rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Model Code *</label>
                    <input
                      type="text"
                      required
                      value={newDeviceModel}
                      onChange={(e) => setNewDeviceModel(e.target.value)}
                      placeholder="E.g. UM3402, Macbook Pro"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-255 bg-slate-50/50 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Operating System *</label>
                    <select
                      value={newDeviceOS}
                      onChange={(e) => setNewDeviceOS(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-255 bg-white rounded-xl focus:outline-none"
                    >
                      <option value="Windows 11">Windows 11</option>
                      <option value="Windows 10">Windows 10</option>
                      <option value="macOS Sequoia">macOS Sequoia</option>
                      <option value="Linux Ubuntu">Linux Ubuntu</option>
                      <option value="Android OS">Android OS</option>
                      <option value="iOS Standard">iOS Standard</option>
                      <option value="other">Other (Specify below)</option>
                    </select>
                  </div>
                </div>

                {newDeviceOS === 'other' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <label className="text-[9px] uppercase font-semibold text-royal font-mono">Custom Operating System *</label>
                    <input
                      type="text"
                      required
                      value={customOS}
                      onChange={(e) => setCustomOS(e.target.value)}
                      placeholder="e.g. ChromeOS, FreeBSD"
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-white rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-455 block font-mono">Hardware Serial Code / IMEI *</label>
                  <input
                    type="text"
                    required
                    value={newDeviceSN}
                    onChange={(e) => setNewDeviceSN(e.target.value)}
                    placeholder="E.g. SN-8928372-GH"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-255 bg-slate-50/50 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Dynamic Image & Video Upload Section */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <span className="text-[10px] uppercase font-semibold text-navy font-mono block">Media Attachments</span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Images Picker */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold text-slate-500 block">Device Images * (Choose multiple)</label>
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2 text-[11px] font-bold text-slate-705 cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4 text-slate-505" />
                        <span>{imageLoading ? 'Loading...' : 'Select Images'}</span>
                      </button>
                      <input 
                        type="file"
                        multiple
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleImageUploadChange}
                        className="hidden"
                      />
                    </div>

                    {/* Video Picker */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold text-slate-500 block">Device Video File (Optional check)</label>
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2 text-[11px] font-bold text-slate-705 cursor-pointer"
                      >
                        <Video className="w-4 h-4 text-slate-505" />
                        <span>{videoLoading ? 'Loading...' : attachedVideo ? 'Video Attached ✓' : 'Select Video'}</span>
                      </button>
                      <input 
                        type="file"
                        accept="video/*"
                        ref={videoInputRef}
                        onChange={handleVideoUploadChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Previews grids */}
                  {attachedImages.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] uppercase font-bold text-slate-400">Attached Images Thumbnails</p>
                      <div className="flex flex-wrap gap-2">
                        {attachedImages.map((src, i) => (
                          <div key={i} className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden relative group">
                            <img src={src} className="w-full h-full object-cover" alt="Attached preview" />
                            <button
                              type="button"
                              onClick={() => {
                                setAttachedImages(attachedImages.filter((_, idx) => idx !== i));
                                setAttachedImageFiles(attachedImageFiles.filter((_, idx) => idx !== i));
                              }}
                              className="absolute inset-0 bg-red-655/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {attachedVideo && (
                    <div className="space-y-1.5 border-t border-slate-105 pt-2.5">
                      <p className="text-[9px] uppercase font-bold text-slate-400">Attached Video Preview</p>
                      <div className="flex items-center space-x-3 bg-white border border-slate-200 p-2 rounded-xl">
                        <Video className="w-5 h-5 text-royal" />
                        <span className="font-mono text-[9.5px] text-slate-500 truncate max-w-[180px]">video_asset_triage.mp4</span>
                        <button
                          type="button"
                          onClick={() => setAttachedVideo('')}
                          className="ml-auto p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded border border-red-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Custom Fields configuration */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <span className="text-[10px] uppercase font-semibold text-navy font-mono block">Custom Field Attributes</span>
                  
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-bold block">Label / Spec Title</label>
                      <input 
                        type="text"
                        placeholder="e.g. Battery Capacity, GPU"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-805 focus:outline-none font-sans"
                      />
                    </div>
                    <div className="space-y-1 flex gap-2">
                      <div className="flex-grow">
                        <label className="text-[9px] text-slate-500 font-bold block">Value</label>
                        <input 
                          type="text"
                          placeholder="e.g. 5000mAh, NVIDIA RTX"
                          value={newFieldValue}
                          onChange={(e) => setNewFieldValue(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-805 focus:outline-none font-sans"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addCustomField}
                        className="py-1.5 px-3 bg-navy hover:bg-slate-900 text-white rounded-lg font-bold uppercase cursor-pointer text-center border-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {customFields.length > 0 && (
                    <div className="space-y-1.5 border-t border-slate-105 pt-2.5">
                      {customFields.map((field, i) => (
                        <div key={i} className="flex justify-between items-center bg-white border border-slate-150 p-2 rounded-xl text-[10px] font-sans">
                          <span className="font-bold text-navy">{field.label}: <span className="font-normal text-slate-655">{field.value}</span></span>
                          <button
                            type="button"
                            onClick={() => removeCustomField(i)}
                            className="p-1 text-slate-450 hover:text-red-500 cursor-pointer border-0 bg-transparent"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDeviceModal(false)}
                    className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-805 rounded-xl font-bold uppercase tracking-wider cursor-pointer border-0 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deviceAdding}
                    className="flex-grow py-3 flex justify-center items-center gap-2 bg-navy hover:bg-slate-900 text-white font-bold uppercase tracking-wider rounded-xl cursor-pointer border-0 text-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {deviceAdding ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Register'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: SUBMIT TECHNICAL DIAGNOSTICS REQUEST */}
      <AnimatePresence>
        {showAddRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 text-xs font-sans select-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl text-left my-8"
            >
              <button 
                onClick={() => setShowAddRequestModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9px] uppercase font-bold text-royal font-mono block">Service Pipeline</span>
                <h3 className="text-lg font-bold text-navy uppercase mt-1">Submit technical diagnostics request</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Filter technical request options based on your active plan tier.</p>
              </div>

              <form onSubmit={handleMakeRequestSubmit} className="space-y-4 text-xs mt-4">
                
                <div className="space-y-1.5">
                  <label className="text-[9.5px] uppercase font-bold text-slate-450 block font-mono">Select Service Type *</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-255 rounded-xl focus:outline-none"
                  >
                    {getSelectableRequestServices().map((serv) => (
                      <option key={serv.value} value={serv.value}>{serv.label}</option>
                    ))}
                  </select>
                </div>

                {/* Device selection list if Hardware or Software fixes are selected */}
                {!reqCategory.includes('website') && (
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] uppercase font-bold text-slate-450 block font-mono">Select Registered Device *</label>
                    <select
                      required
                      value={reqDeviceId}
                      onChange={(e) => setReqDeviceId(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-255 rounded-xl focus:outline-none focus:border-royal"
                    >
                      <option value="">-- Choose registered device --</option>
                      {devices.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} (ID: {d.id})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9.5px] uppercase font-bold text-slate-455 block font-mono">Request Title *</label>
                  <input
                    type="text"
                    required
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    placeholder="E.g. Install Python IDE, Keyboard faults repair"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-255 bg-slate-50/50 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] uppercase font-bold text-slate-455 block font-mono">Explain your issue *</label>
                  <textarea
                    rows={4}
                    required
                    value={reqDesc}
                    onChange={(e) => setReqDesc(e.target.value)}
                    placeholder="Provide descriptions of requested setup details or device fault patterns..."
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-255 bg-slate-50/50 rounded-xl focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] uppercase font-bold text-slate-455 block font-mono">Urgency Level</label>
                    <select
                      value={reqPriority}
                      onChange={(e) => setReqPriority(e.target.value as any)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-255 rounded-xl focus:outline-none"
                    >
                      <option value="low">Low Urgency</option>
                      <option value="medium">Medium Urgency</option>
                      <option value="high">High Urgency</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2.5 pt-5.5">
                    <button
                      type="button"
                      onClick={() => setShowAddRequestModal(false)}
                      className="w-1/2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-805 rounded-xl font-bold uppercase tracking-wider cursor-pointer border-0 text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={requestSubmitting}
                      className="flex-grow py-3.5 flex justify-center items-center gap-2 bg-royal hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-0 text-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {requestSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
