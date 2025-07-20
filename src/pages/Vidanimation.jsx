import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import '../ScrollVideo.css'; 

const ScrollVideo = () => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [looping, setLooping] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);

    const loopStart = 4;
    const loopEnd = 5;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const videoTime = useSpring(0, {
        stiffness: 400,
        damping: 40,
        mass: 0.1
    });

    const smoothVideoTime = useTransform(scrollYProgress, [0, 1], [0, videoDuration]);

    const scrollTimeout = useRef(null);

    useEffect(() => {
        const unsubscribe = smoothVideoTime.onChange((latest) => {
            const video = videoRef.current;
            if (!video || !isVideoReady || looping) return;
            if (Math.abs(video.currentTime - latest) > 0.05) {
                video.currentTime = latest;
            }
        });

        return unsubscribe;
    }, [smoothVideoTime, isVideoReady, looping]);

    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange(() => {
            if (looping) setLooping(false);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => setLooping(true), 150);
        });

        return () => {
            unsubscribe();
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [scrollYProgress, looping]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !looping || !isVideoReady) return;

        video.currentTime = loopStart;

        const startLoop = () => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => console.warn("Playback error:", err));
            }
        };

        const loopHandler = () => {
            if (video.currentTime >= loopEnd) {
                video.currentTime = loopStart;
                startLoop();
            }
        };

        startLoop();
        video.addEventListener("timeupdate", loopHandler);

        return () => {
            video.pause();
            video.removeEventListener("timeupdate", loopHandler);
        };
    }, [looping, isVideoReady]);

    const handleVideoReady = () => {
        const video = videoRef.current;
        if (video && video.duration) {
            setVideoDuration(video.duration);
            setIsVideoReady(true);
            video.currentTime = scrollYProgress.get() * video.duration;
        }
    };

    return (
        <div ref={containerRef} className="container">
            {/* Fixed background video */}
            <motion.video
                ref={videoRef}
                src="/images/video3.mp4"
                muted
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                onLoadedData={handleVideoReady}
                onCanPlayThrough={handleVideoReady}
                className="video-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVideoReady ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            />

            {/* Content sections */}
            <div className="content-wrapper">
                {/* Section 1 */}
                <motion.div
                    className="section"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h1 className="section-title">Xiaomi Bluetooth Speaker</h1>
                    <p className="section-subtitle">Next-level sound quality</p>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                    className="section"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <p className="section-subtitle">Xiaomi Bluetooth Speaker Series</p>
                    <h2 className="section-heading">Stretching the boundaries of audio quality</h2>
                    <p className="section-description">
                        Superior sound performance. Driven by the desire to accurately reproduce every note,
                        Xiaomi Bluetooth Speaker Series continues to pursue the 'authentic' audio philosophy.
                        The self-developed 'symmetric architecture design' and groundbreaking computational
                        audio technology work together to deliver a harmonious and natural audio experience.
                    </p>
                </motion.div>

                {/* Section 3 - Product Details */}
                <motion.div
                    className="section"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-heading">Product details</h2>
                    <div className="product-details">
                        <div className="detail-box">
                            <h3>IP67 dust and water-resistant</h3>
                            <p>Lorem ipsum dolor sit amet consectetur.</p>
                        </div>
                        <div className="detail-box">
                            <h3>17h battery life</h3>
                            <p>Lorem ipsum dolor sit amet consectetur.</p>
                        </div>
                        <div className="detail-box">
                            <h3>22.5W fast charging</h3>
                            <p>Lorem ipsum dolor sit amet consectetur.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 4 - The End */}
                <motion.div
                    className="section end-section"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-heading">The End</h2>
                    <p className="section-subtitle">
                        Equipped with Bluetooth 5.3. Enjoy exhilarating high-fidelity audio outdoors.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ScrollVideo;
