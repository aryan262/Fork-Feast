import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Earth, Loader2, LocateIcon, Mail, MapPin, Plus } from 'lucide-react'
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'sonner';

function Profile() {
    const {user, updateProfile} = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const imageref = useRef(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState(profileData.profilePicture||"");
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName||"",
        email: user?.email||"",
        address: user?.address||"",
        city: user?.city||"",
        country: user?.country||"",
        profilePicture: user?.profilePicture||""
    })

    const fileChangeHandler = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setSelectedProfilePicture(result);
                setProfileData((prev) => ({
                    ...prev,
                    profilePicture: result
                }))
            }
            reader.readAsDataURL(file);
        }
    }

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setProfileData({ ...profileData, [name]: value });

    }

    const updateProfileHandler = async(event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await updateProfile(profileData);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false);
            toast.error("Error Updating Profile")
        }
    }

    return (
        <form className='max-w-7xl mx-auto my-5' onSubmit={updateProfileHandler}>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar className="relative md:w-28 md:h-28 w-20 h-20" >
                        <AvatarImage src={selectedProfilePicture} />
                        <AvatarFallback>{profileData.fullName[0]}</AvatarFallback>
                        <input ref={imageref} type='file' className='hidden' accept='image/*' onChange={fileChangeHandler} />
                        <div onClick={() => imageref.current?.click()} className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer'>
                            <Plus className='text-white w-8 h-8' />
                        </div>
                    </Avatar>
                    <Input type="text" name="fullName" value={profileData.fullName} onChange={changeHandler} className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent" />
                </div>
            </div>
            <div className='grid md:grid-cols-4 md:gap-2 gap-3 my-10'>
                <div className='flex items-center gap-4 rounded-sm p-2 bg-gray-200'>
                    <Mail className='text-grey-500' />
                    <div className='w-full'>
                        <Label>Email</Label>
                        <input disabled name='email' value={profileData.email} onChange={changeHandler} className='w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-within:border-transparent outline-none border-none' />
                    </div>
                </div>
                <div className='flex items-center gap-4 rounded-sm p-2 bg-gray-200'>
                    <LocateIcon className='text-grey-500' />
                    <div className='w-full'>
                        <Label>Address</Label>
                        <input name='address' value={profileData.address} onChange={changeHandler} className='w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-within:border-transparent outline-none border-none' />
                    </div>
                </div>
                <div className='flex items-center gap-4 rounded-sm p-2 bg-gray-200'>
                    <MapPin className='text-grey-500' />
                    <div className='w-full'>
                        <Label>City</Label>
                        <input name='city' value={profileData.city} onChange={changeHandler} className='w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-within:border-transparent outline-none border-none' />
                    </div>
                </div>
                <div className='flex items-center gap-4 rounded-sm p-2 bg-gray-200'>
                    <Earth className='text-grey-500' />
                    <div className='w-full'>
                        <Label>Country</Label>
                        <input name='country' value={profileData.country} onChange={changeHandler} className='w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-within:border-transparent outline-none border-none' />
                    </div>
                </div>
            </div>
            <div className="text-center">
                {
                    isLoading ?
                    (<Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className=' mr-2 w-4 h-4 animate-spin' />Updating...</Button>) :
                        (<Button className="bg-orange hover:bg-hoverOrange">Update</Button>)
                }
            </div>
        </form>
    )
}

export default Profile