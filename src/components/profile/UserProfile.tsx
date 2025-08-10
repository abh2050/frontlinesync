import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/hooks/use-auth'
import { useKV } from '@/hooks/use-kv'
import { 
  User, 
  ShieldCheck, 
  CalendarBlank, 
  Clock, 
  Plus, 
  Upload,
  CheckCircle,
  Warning,
  Star,
  PencilSimple,
  Globe
} from '@phosphor-icons/react'
import { Credential, User as UserType } from '@/types'
import APP_CONFIG from '@/config/app'

export default function UserProfile() {
  const { user, logout } = useAuth()
  const [isPencilSimpleing, setIsPencilSimpleing] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const credentialsKV = useKV<Credential[]>('user_credentials', [])
  const credentials = credentialsKV.value
  const setCredentials = credentialsKV.set
  const profileDataKV = useKV<Partial<UserType>>('profile_data', {})
  const profileData = profileDataKV.value
  const setProfileData = profileDataKV.set

  const activeCredentials = credentials.filter(c => c.status === 'active')
  const expiredCredentials = credentials.filter(c => c.status === 'expired')
  const pendingCredentials = credentials.filter(c => c.status === 'pending')

  const getExpirationStatus = (credential: Credential) => {
    if (!credential.expirationDate) return null
    
    const expDate = new Date(credential.expirationDate)
    const now = new Date()
    const daysUntilExpiration = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiration < 0) return { status: 'expired', days: Math.abs(daysUntilExpiration), color: 'text-red-600' }
    if (daysUntilExpiration <= 30) return { status: 'expiring', days: daysUntilExpiration, color: 'text-yellow-600' }
    return { status: 'valid', days: daysUntilExpiration, color: 'text-green-600' }
  }

  const skills = user?.skills || ['Food Safety', 'Customer Service', 'POS Systems', 'Team Leadership']

  const completionPercentage = Math.round((activeCredentials.length / (activeCredentials.length + expiredCredentials.length + 2)) * 100)

  const handleLogout = async () => {
    await logout()
    setShowLogoutDialog(false)
  }

  return (
    <div className="p-4 space-y-6 md:p-6 md:pl-72">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your information and credentials</p>
        </div>
        <Button variant="outline" onClick={() => setIsPencilSimpleing(!isPencilSimpleing)}>
          <PencilSimple className="w-4 h-4 mr-2" />
          {isPencilSimpleing ? 'Save Changes' : 'PencilSimple Profile'}
        </Button>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  {isPencilSimpleing ? (
                    <Input defaultValue={user?.name} />
                  ) : (
                    <p className="text-lg font-semibold">{user?.name}</p>
                  )}
                </div>
                <div>
                  <Label>Email</Label>
                  {isPencilSimpleing ? (
                    <Input defaultValue={user?.email} />
                  ) : (
                    <p className="text-lg">{user?.email}</p>
                  )}
                </div>
                <div>
                  <Label>Department</Label>
                  {isPencilSimpleing ? (
                    <Input defaultValue={user?.department} />
                  ) : (
                    <p className="text-lg">{user?.department}</p>
                  )}
                </div>
                <div>
                  <Label>Role</Label>
                  <Badge variant="outline" className="mt-1">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Skills & Competencies</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
            {isPencilSimpleing && (
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credentials Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Certification Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">{completionPercentage}% Complete</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{activeCredentials.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{pendingCredentials.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Warning className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{expiredCredentials.length}</p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Credentials</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credential
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Credential</DialogTitle>
                  <DialogDescription>
                    Upload a new certification or training completion
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Credential Name</Label>
                    <Input placeholder="e.g., Food Safety Certification" />
                  </div>
                  <div>
                    <Label>Issuing Organization</Label>
                    <Input placeholder="e.g., ServSafe" />
                  </div>
                  <div>
                    <Label>Date Earned</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Expiration Date (if applicable)</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Upload Document</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    </div>
                  </div>
                  <Button className="w-full">Add Credential</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {credentials.map((credential, index) => {
              const expStatus = getExpirationStatus(credential)
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      credential.status === 'active' ? 'bg-green-500' :
                      credential.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <h3 className="font-semibold">{credential.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Issued by {credential.issuer} • {new Date(credential.dateEarned).toLocaleDateString()}
                      </p>
                      {expStatus && (
                        <p className={`text-sm ${expStatus.color}`}>
                          {expStatus.status === 'expired' 
                            ? `Expired ${expStatus.days} days ago`
                            : expStatus.status === 'expiring'
                            ? `Expires in ${expStatus.days} days`
                            : `Valid for ${expStatus.days} days`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      credential.status === 'active' ? 'default' :
                      credential.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {credential.status}
                    </Badge>
                    {credential.documentUrl && (
                      <Button variant="outline" size="sm">
                        View Document
                      </Button>
                    )}
                    {credential.status === 'expired' && (
                      <Button variant="outline" size="sm">
                        Renew
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Privacy</h3>
                <p className="text-sm text-muted-foreground">Control your privacy settings</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Visit Website</h3>
                <p className="text-sm text-muted-foreground">Learn more about {APP_CONFIG.appName}</p>
              </div>
              <Button variant="outline" asChild>
                <a href={APP_CONFIG.domain} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>frontlinesync.com</span>
                </a>
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-t pt-4">
              <div>
                <h3 className="font-medium text-red-600">Sign Out</h3>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
              <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign Out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out? You'll need to log in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}