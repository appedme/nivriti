'use client';

import { useState } from 'react';
import { Save, Upload, Eye, EyeOff, Bell, Shield, Palette, Globe, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Sarah Chen',
    username: 'sarahwrites',
    email: 'sarah@example.com',
    bio: 'Finding stories in everyday moments. Writer, dreamer, and lover of morning coffee.',
    location: 'San Francisco, CA',
    website: 'https://sarahchen.blog',
    avatar: '/api/placeholder/120/120'
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showLocation: true,
    allowComments: true,
    allowMessages: true
  });

  const [notifications, setNotifications] = useState({
    emailNewFollower: true,
    emailNewComment: true,
    emailNewLike: false,
    emailWeeklyDigest: true,
    pushNewFollower: true,
    pushNewComment: true,
    pushNewLike: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    readingMode: 'comfortable',
    autoSave: true,
    showReadingProgress: true
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyUpdate = (field, value) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationUpdate = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceUpdate = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save settings to API
    alert('Settings saved successfully!');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                
                {/* Avatar Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={profile.avatar} 
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Photo
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <Input
                      value={profile.username}
                      onChange={(e) => handleProfileUpdate('username', e.target.value)}
                      className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                      value={profile.location}
                      onChange={(e) => handleProfileUpdate('location', e.target.value)}
                      className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <Input
                      type="url"
                      value={profile.website}
                      onChange={(e) => handleProfileUpdate('website', e.target.value)}
                      className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                      rows={4}
                      className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                    />
                    <p className="text-sm text-gray-500 mt-1">Tell others about yourself in a few words</p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Public Profile</h3>
                      <p className="text-sm text-gray-600">Make your profile visible to everyone</p>
                    </div>
                    <Switch
                      checked={privacy.profilePublic}
                      onCheckedChange={(value) => handlePrivacyUpdate('profilePublic', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Show Email</h3>
                      <p className="text-sm text-gray-600">Display your email on your profile</p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(value) => handlePrivacyUpdate('showEmail', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Show Location</h3>
                      <p className="text-sm text-gray-600">Display your location on your profile</p>
                    </div>
                    <Switch
                      checked={privacy.showLocation}
                      onCheckedChange={(value) => handlePrivacyUpdate('showLocation', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Allow Comments</h3>
                      <p className="text-sm text-gray-600">Let others comment on your stories</p>
                    </div>
                    <Switch
                      checked={privacy.allowComments}
                      onCheckedChange={(value) => handlePrivacyUpdate('allowComments', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Allow Messages</h3>
                      <p className="text-sm text-gray-600">Let others send you direct messages</p>
                    </div>
                    <Switch
                      checked={privacy.allowMessages}
                      onCheckedChange={(value) => handlePrivacyUpdate('allowMessages', value)}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">New Follower</p>
                          <p className="text-sm text-gray-600">When someone follows you</p>
                        </div>
                        <Switch
                          checked={notifications.emailNewFollower}
                          onCheckedChange={(value) => handleNotificationUpdate('emailNewFollower', value)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">New Comment</p>
                          <p className="text-sm text-gray-600">When someone comments on your story</p>
                        </div>
                        <Switch
                          checked={notifications.emailNewComment}
                          onCheckedChange={(value) => handleNotificationUpdate('emailNewComment', value)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">New Like</p>
                          <p className="text-sm text-gray-600">When someone likes your story</p>
                        </div>
                        <Switch
                          checked={notifications.emailNewLike}
                          onCheckedChange={(value) => handleNotificationUpdate('emailNewLike', value)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Weekly Digest</p>
                          <p className="text-sm text-gray-600">Summary of your activity and new stories</p>
                        </div>
                        <Switch
                          checked={notifications.emailWeeklyDigest}
                          onCheckedChange={(value) => handleNotificationUpdate('emailWeeklyDigest', value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">New Follower</p>
                          <p className="text-sm text-gray-600">When someone follows you</p>
                        </div>
                        <Switch
                          checked={notifications.pushNewFollower}
                          onCheckedChange={(value) => handleNotificationUpdate('pushNewFollower', value)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">New Comment</p>
                          <p className="text-sm text-gray-600">When someone comments on your story</p>
                        </div>
                        <Switch
                          checked={notifications.pushNewComment}
                          onCheckedChange={(value) => handleNotificationUpdate('pushNewComment', value)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">New Like</p>
                          <p className="text-sm text-gray-600">When someone likes your story</p>
                        </div>
                        <Switch
                          checked={notifications.pushNewLike}
                          onCheckedChange={(value) => handleNotificationUpdate('pushNewLike', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  App Preferences
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => handlePreferenceUpdate('theme', e.target.value)}
                      className="w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceUpdate('language', e.target.value)}
                      className="w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reading Mode</label>
                    <select
                      value={preferences.readingMode}
                      onChange={(e) => handlePreferenceUpdate('readingMode', e.target.value)}
                      className="w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="comfortable">Comfortable</option>
                      <option value="compact">Compact</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Auto-save Drafts</h3>
                      <p className="text-sm text-gray-600">Automatically save your work while writing</p>
                    </div>
                    <Switch
                      checked={preferences.autoSave}
                      onCheckedChange={(value) => handlePreferenceUpdate('autoSave', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Show Reading Progress</h3>
                      <p className="text-sm text-gray-600">Display progress bar while reading stories</p>
                    </div>
                    <Switch
                      checked={preferences.showReadingProgress}
                      onCheckedChange={(value) => handlePreferenceUpdate('showReadingProgress', value)}
                    />
                  </div>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 bg-red-50 border border-red-200 shadow-lg">
                <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-red-900">Delete Account</h3>
                      <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
                
                {showDeleteConfirm && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                    <p className="text-red-900 font-medium mb-2">Are you sure?</p>
                    <p className="text-red-700 text-sm mb-4">This action cannot be undone. All your stories, comments, and data will be permanently deleted.</p>
                    <div className="flex space-x-3">
                      <Button variant="destructive" size="sm">Confirm Delete</Button>
                      <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
