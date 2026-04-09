"use client"

import * as React from "react"
import { useAuthStore } from "@/store/auth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Settings, User, Save, CheckCircle2, AlertCircle, Camera, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { storage } from "@/lib/firebase/config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function SettingsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const { t, language } = useTranslation()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [profileData, setProfileData] = React.useState({
    full_name: "",
    email: "",
    avatar_url: "",
  })

  React.useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.uid)
        .single()
        
      if (data) {
        setProfileData({
          full_name: data.full_name || "",
          email: data.email || "",
          avatar_url: data.avatar_url || "",
        })
      }
      setIsLoading(false)
    }
    fetchProfile()
  }, [user, supabase])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    setMessage(null)
    try {
      const fileName = `${user.uid}_${Date.now()}_${file.name}`
      const storageRef = ref(storage, `avatars/${fileName}`)
      
      const snapshot = await uploadBytes(storageRef, file)
      const publicUrl = await getDownloadURL(snapshot.ref)

      // Update local state
      setProfileData({ ...profileData, avatar_url: publicUrl })
      
      // Update database immediately for avatar
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.uid)

      if (updateError) throw updateError
      
      setMessage({ type: 'success', text: language === 'fr' ? "Photo de profil mise à jour !" : "Profile photo updated!" })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)
    setMessage(null)
    
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileData.full_name,
      })
      .eq("id", user.uid)

    setIsSaving(false)
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: language === 'fr' ? "Profil mis à jour avec succès !" : "Profile updated successfully!" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">{t('dashboard.settings')}</h1>
        <p className="text-muted-foreground font-medium">{language === 'fr' ? "Gérez les paramètres de votre compte personnel." : "Manage your personal account settings."}</p>
      </div>

      <Card className="border-none shadow-xl bg-white/70 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-600">
              <User size={20} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{language === 'fr' ? "Informations Personnelles" : "Personal Information"}</CardTitle>
              <CardDescription>{language === 'fr' ? "Mettez à jour vos coordonnées personnelles." : "Update your personal details."}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
            <div className="relative group">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-2xl">
                <AvatarImage src={profileData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.full_name}`} />
                <AvatarFallback>{profileData.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <label className={cn(
                "absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all",
                isUploading && "opacity-50 pointer-events-none"
              )}>
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              </label>
            </div>
            <div className="text-center sm:text-left">
               <h3 className="text-xl font-black text-slate-900">{profileData.full_name}</h3>
               <p className="text-sm font-medium text-muted-foreground">{profileData.email}</p>
               <p className="text-[11px] font-bold text-primary mt-2 uppercase tracking-wider bg-primary/10 w-fit px-2 py-1 rounded-md mx-auto sm:mx-0">Vendeur Certifié</p>
            </div>
          </div>

          <form id="profile-form" onSubmit={handleSave} className="space-y-6 max-w-xl">
            {message && (
              <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold">{language === 'fr' ? "Nom Complet" : "Full Name"}</label>
              <Input 
                value={profileData.full_name}
                onChange={e => setProfileData({...profileData, full_name: e.target.value})}
                className="h-12 rounded-xl bg-slate-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">{language === 'fr' ? "Adresse E-mail" : "Email Address"}</label>
              <Input 
                value={profileData.email}
                disabled
                className="h-12 rounded-xl bg-slate-100 text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground">{language === 'fr' ? "L'adresse e-mail est gérée via votre compte Google." : "Email address is managed via your Google account."}</p>
            </div>

          </form>
        </CardContent>
        <CardFooter className="py-4 border-t bg-slate-50/50 rounded-b-xl">
          <Button 
            type="submit" 
            form="profile-form"
            variant="premium" 
            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 bg-slate-900"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18}/>}
            {isSaving ? t('common.saving') : t('common.save')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


