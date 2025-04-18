"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { isTeacher, isAdmin } from '@/lib/acl';

export default function TopNavbar() {
    const { data: session } = useSession();
    const user = session?.user;
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [time, setTime] = useState({
        atlanta: '',
        dubai: '',
        beijing: ''
    });

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            
            const atlantaTime = new Date(now.getTime());
            atlantaTime.setHours(now.getUTCHours() - 4);
            
            const dubaiTime = new Date(now.getTime());
            dubaiTime.setHours(now.getUTCHours() + 4);
            
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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav id="top-nav" className="top-0 z-50 transition duration-200">
            <div className="shadow-md h-[50px] bg-white relative z-[21] flex">
                <div className="max-w-6xl w-full mx-auto">
                    <div className="flex justify-between h-full">
                        <ul className="hidden lg:flex border-s border-gray-300">
                            <li className="group flex relative border-e border-gray-300 w-[6rem]">
                                <div className={`absolute transition-all w-full top-0 ${pathname === '/' ? 'bg-[#193182]' : 'group-hover:bg-[#193182]'} ${pathname === '/' ? 'h-[10px]' : 'h-0 group-hover:h-[10px]'}`}></div>
                                <Link className={`text-sm font-medium flex w-full items-center space-x-1.5 ps-4 ${pathname === '/' ? 'text-black' : 'text-gray-500 group-hover:text-black'} transition`} href="/">
                                    <span>Home</span>
                                </Link>
                            </li>
                            {user && (
                                <li className="group flex relative border-e border-gray-300 w-[10rem]">
                                    <div className={`absolute transition-all w-full top-0 ${pathname.startsWith('/opportunities') ? 'bg-[#193182]' : 'group-hover:bg-[#193182]'} ${pathname.startsWith('/opportunities') ? 'h-[10px]' : 'h-0 group-hover:h-[10px]'}`}></div>
                                    <Link className={`text-sm font-medium flex w-full items-center space-x-1.5 ps-4 ${pathname.startsWith('/opportunities') ? 'text-black' : 'text-gray-500 group-hover:text-black'} transition`} href="/opportunities">
                                        <span>Opportunities</span>
                                    </Link>
                                </li>
                            )}
                            {user && (
                                <li className="group flex relative border-e border-gray-300 w-[12rem]">
                                    <div className={`absolute transition-all w-full top-0 ${pathname.startsWith('/applications') ? 'bg-[#193182]' : 'group-hover:bg-[#193182]'} ${pathname.startsWith('/applications') ? 'h-[10px]' : 'h-0 group-hover:h-[10px]'}`}></div>
                                    <Link className={`text-sm font-medium flex w-full items-center space-x-1.5 ps-4 ${pathname.startsWith('/applications') ? 'text-black' : 'text-gray-500 group-hover:text-black'} transition`} href="/applications">
                                        <span>My Applications</span>
                                    </Link>
                                </li>
                            )}
                            {user && isTeacher(user) && (
                                <>
                                    <li className="group flex relative border-e border-gray-300 w-[14rem]">
                                        <div className={`absolute transition-all w-full top-0 ${pathname === '/applications/manage' ? 'bg-[#193182]' : 'group-hover:bg-[#193182]'} ${pathname === '/applications/manage' ? 'h-[10px]' : 'h-0 group-hover:h-[10px]'}`}></div>
                                        <Link className={`text-sm font-medium flex w-full items-center space-x-1.5 ps-4 ${pathname === '/applications/manage' ? 'text-black' : 'text-gray-500 group-hover:text-black'} transition`} href="/applications/manage">
                                            <span>Manage Applications</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                            {user && isAdmin(user) && (
                                <li className="group flex relative border-e border-gray-300 w-[12rem]">
                                    <div className={`absolute transition-all w-full top-0 ${pathname === '/admin' ? 'bg-[#193182]' : 'group-hover:bg-[#193182]'} ${pathname === '/admin' ? 'h-[10px]' : 'h-0 group-hover:h-[10px]'}`}></div>
                                    <Link className={`text-sm font-medium flex w-full items-center space-x-1.5 ps-4 ${pathname === '/admin' ? 'text-black' : 'text-gray-500 group-hover:text-black'} transition`} href="/admin">
                                        <span>Admin Dashboard</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                        
                        <div className="flex items-center justify-between w-full px-4 lg:hidden">
                            <button 
                                className="text-black"
                                onClick={toggleMobileMenu}
                                aria-expanded={mobileMenuOpen}
                                aria-label="Toggle navigation menu"
                            >
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
                                    {user ? (
                                        <Link href="/api/auth/signout" className="text-xs px-4 leading-[0.875rem] flex items-center h-full w-full text-white font-bold">
                                            Sign Out
                                        </Link>
                                    ) : (
                                        <Link href="/api/auth/signin" className="text-xs px-4 leading-[0.875rem] flex items-center h-full w-full text-white font-bold">
                                            Sign In
                                        </Link>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="fixed lg:hidden z-50 inset-0 w-full p-3 bg-transparent overflow-y-scroll">
                    <div className="rounded bg-white shadow-lg overflow-hidden">
                        <div className="px-4 mb-1">
                            <button 
                                className="text-gray-500 font-medium text-sm"
                                onClick={toggleMobileMenu}
                            >
                                Close menu
                            </button>
                        </div>
                        <ul className="border-b border-gray-300 divide-y divide-gray-300">
                            <li>
                                <Link 
                                    href="/" 
                                    className={`border-l-8 px-4 py-2 flex items-center justify-start space-x-2 ${pathname === '/' ? 'border-[#193182]' : 'border-transparent'}`}
                                    onClick={toggleMobileMenu}
                                >
                                    <span>Home</span>
                                </Link>
                            </li>
                            
                            {user && (
                                <li>
                                    <Link 
                                        href="/opportunities" 
                                        className={`border-l-8 px-4 py-2 flex items-center justify-start space-x-2 ${pathname.startsWith('/opportunities') ? 'border-[#193182]' : 'border-transparent'}`}
                                        onClick={toggleMobileMenu}
                                    >
                                        <span>Opportunities</span>
                                    </Link>
                                </li>
                            )}
                            
                            {user && (
                                <li>
                                    <Link 
                                        href="/applications" 
                                        className={`border-l-8 px-4 py-2 flex items-center justify-start space-x-2 ${pathname.startsWith('/applications') ? 'border-[#193182]' : 'border-transparent'}`}
                                        onClick={toggleMobileMenu}
                                    >
                                        <span>My Applications</span>
                                    </Link>
                                </li>
                            )}
                            
                            {user && isTeacher(user) && (
                                <>
                                    <li>
                                        <Link 
                                            href="/applications/manage" 
                                            className={`border-l-8 px-4 py-2 flex items-center justify-start space-x-2 ${pathname === '/applications/manage' ? 'border-[#193182]' : 'border-transparent'}`}
                                            onClick={toggleMobileMenu}
                                        >
                                            <span>Manage Applications</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                            
                            {user && isAdmin(user) && (
                                <li>
                                    <Link 
                                        href="/admin" 
                                        className={`border-l-8 px-4 py-2 flex items-center justify-start space-x-2 ${pathname === '/admin' ? 'border-[#193182]' : 'border-transparent'}`}
                                        onClick={toggleMobileMenu}
                                    >
                                        <span>Admin Dashboard</span>
                                    </Link>
                                </li>
                            )}
                            
                            <li>
                                {user ? (
                                    <Link 
                                        href="/api/auth/signout" 
                                        className={`border-l-8 px-4 py-2 flex items-center justify-start space-x-2 border-transparent`}
                                        onClick={toggleMobileMenu}
                                    >
                                        <span>Sign Out</span>
                                    </Link>
                                ) : (
                                    <Link 
                                        href="/api/auth/signin" 
                                        className={`border-l-8 px-4 py-2 flex items-center justify-start space-x-2 border-transparent`}
                                        onClick={toggleMobileMenu}
                                    >
                                        <span>Sign In</span>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
} 