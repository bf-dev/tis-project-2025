"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from './AuthComponents';
import { isTeacher, isAdmin } from '@/lib/acl';

const TopNavbar = () => {
    const { user } = useUser();
    const [time, setTime] = useState({
        atlanta: '',
        dubai: '',
        beijing: ''
    });

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            
            // Atlanta (UTC-4)
            const atlantaTime = new Date(now.getTime());
            atlantaTime.setHours(now.getUTCHours() - 4);
            
            // Dubai (UTC+4)
            const dubaiTime = new Date(now.getTime());
            dubaiTime.setHours(now.getUTCHours() + 4);
            
            // Beijing (UTC+8)
            const beijingTime = new Date(now.getTime());
            beijingTime.setHours(now.getUTCHours() + 8);
            
            setTime({
                atlanta: atlantaTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit', 
                    hour12: false 
                }),
                dubai: dubaiTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit', 
                    hour12: false 
                }),
                beijing: beijingTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit', 
                    hour12: false 
                })
            });
        };
        
        updateTime();
        const timer = setInterval(updateTime, 1000);
        
        return () => clearInterval(timer);
    }, []);

    return (
        <nav id="top-nav" className="top-0 z-50 transition duration-200">
            <div className="shadow-md h-[50px] bg-white relative z-[21] flex">
                <div className="max-w-6xl w-full mx-auto">
                    <div className="flex justify-between h-full">
                        <ul className="hidden lg:flex border-s border-gray-300">
                            <li className="group flex relative border-e border-gray-300 w-[6rem]">
                                <div className="absolute transition-all w-full top-0 bg-[#193182] h-[10px]"></div>
                                <Link className="text-sm font-medium flex w-full items-center space-x-1.5 ps-4 text-black" href="/">
                                    <span>Home</span>
                                </Link>
                            </li>
                            {user && (
                                <li className="group flex relative border-e border-gray-300 w-[10rem]">
                                    <div className="absolute transition-all w-full top-0 group-hover:bg-[#193182] h-0 group-hover:h-[10px]"></div>
                                    <a className="text-sm font-medium flex w-full items-center space-x-1.5 ps-4 text-gray-500 group-hover:text-black transition" href="/opportunities">
                                        <span>Opportunities</span>
                                    </a>
                                </li>
                            )}
                            {user && (
                                <li className="group flex relative border-e border-gray-300 w-[12rem]">
                                    <div className="absolute transition-all w-full top-0 group-hover:bg-[#193182] h-0 group-hover:h-[10px]"></div>
                                    <a className="text-sm font-medium flex w-full items-center space-x-1.5 ps-4 text-gray-500 group-hover:text-black transition" href="/my-applications">
                                        <span>My Applications</span>
                                    </a>
                                </li>
                            )}
                            {user && isTeacher(user) && (
                                <li className="group flex relative border-e border-gray-300 w-[14rem]">
                                    <div className="absolute transition-all w-full top-0 group-hover:bg-[#193182] h-0 group-hover:h-[10px]"></div>
                                    <a className="text-sm font-medium flex w-full items-center space-x-1.5 ps-4 text-gray-500 group-hover:text-black transition" href="/manage-applications">
                                        <span>Manage Applications</span>
                                    </a>
                                </li>
                            )}
                            {user && isAdmin(user) && (
                                <li className="group flex relative border-e border-gray-300 w-[12rem]">
                                    <div className="absolute transition-all w-full top-0 group-hover:bg-[#193182] h-0 group-hover:h-[10px]"></div>
                                    <a className="text-sm font-medium flex w-full items-center space-x-1.5 ps-4 text-gray-500 group-hover:text-black transition" href="/admin/dashboard">
                                        <span>Admin Dashboard</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                        
                        <div className="flex items-center justify-between w-full px-4 lg:hidden">
                            <button className="text-black">
                                <span className="sr-only">Open menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="hidden lg:block">
                            <ul className="flex items-center h-full text-gray-500 border-s border-gray-300">
                                <li className="flex h-full items-center px-4 border-e border-gray-300">
                                    <div className="text-xs">
                                        <div className="font-bold">Atlanta</div>
                                        <div className="whitespace-nowrap font-mono">{time.atlanta}</div>
                                    </div>
                                </li>
                                <li className="flex h-full items-center px-4 border-e border-gray-300">
                                    <div className="text-xs">
                                        <div className="font-bold">Dubai</div>
                                        <div className="whitespace-nowrap font-mono">{time.dubai}</div>
                                    </div>
                                </li>
                                <li className="flex h-full items-center px-4 border-e border-gray-300">
                                    <div className="text-xs">
                                        <div className="font-bold">Beijing</div>
                                        <div className="whitespace-nowrap font-mono">{time.beijing}</div>
                                    </div>
                                </li>
                                <li className="flex w-24 h-full items-center border-e border-gray-300" style={{ backgroundColor: '#193182' }}>
                                    <Link href="/auth/signin" className="text-xs px-4 leading-[0.875rem] flex items-center h-full w-full text-white font-bold">
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavbar; 