import React from 'react';
import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';

import { BASE_URL } from 'config';
// Import Swiper styles
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

SwiperCore.use([Autoplay]);

export default function AdArea() {
    return (
        <Box
            sx={{
                height: '120px',
                marginTop: '-10px',
                marginBottom: '10px'
            }}
        >
            <Swiper
                pagination={{
                    dynamicBullets: true
                }}
                loop
                autoplay={{ delay: 5000 }}
                className="mySwiper"
            >
                <SwiperSlide>
                    <Box
                        sx={{
                            height: '120px',
                            color: '#3e3f3e',
                            background: '#cccccc',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <img alt="avatar" src={`${BASE_URL}/boi-1.png`} style={{ width: '120px' }} />
                        <Box
                            sx={{
                                width: '50%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around'
                            }}
                        >
                            <Box className="referal-txt" sx={{ fontFamily: 'SilkFont', textDecoration: 'underline', fontSize: '20px' }}>
                                REFERAL PROGRAM
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Box sx={{ fontFamily: 'SilkFont', fontSize: '24px', marginBottom: '5px' }}>
                                    INVITE FRIENDS & WIN WHEN THEY WIN
                                </Box>
                                <Box sx={{ fontStyle: 'italic' }}>Earn 2% off winning bets from those you refer to BoiBook</Box>
                            </Box>
                        </Box>
                        <img alt="avatar" src={`${BASE_URL}/boi-2.png`} style={{ width: '120px' }} />
                    </Box>
                </SwiperSlide>
                <SwiperSlide>
                    <Box
                        sx={{
                            height: '120px',
                            color: '#3e3f3e',
                            background: '#cccccc',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <img alt="avatar" src={`${BASE_URL}/boi-3.png`} style={{ width: '120px' }} />
                        <Box
                            sx={{
                                width: '50%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around'
                            }}
                        >
                            <Box className="referal-txt" sx={{ fontFamily: 'SilkFont', textDecoration: 'underline', fontSize: '20px' }}>
                                REFERAL PROGRAM
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Box sx={{ fontFamily: 'SilkFont', fontSize: '24px', marginBottom: '5px' }}>
                                    INVITE FRIENDS & WIN WHEN THEY WIN
                                </Box>
                                <Box sx={{ fontStyle: 'italic' }}>Earn 2% off winning bets from those you refer to BoiBook</Box>
                            </Box>
                        </Box>
                        <img alt="avatar" src={`${BASE_URL}/boi-4.png`} style={{ width: '120px' }} />
                    </Box>
                </SwiperSlide>
            </Swiper>
        </Box>
    );
}
