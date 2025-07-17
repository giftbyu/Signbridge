import { motion } from "framer-motion";
import Image from "next/image";

// Varian animasi untuk garis gerak
const motionLineVariants = {
  hidden: { opacity: 0, x: 0 },
  visible: { opacity: 1, x: 20 }, // Muncul dan bergerak 20px ke samping
};

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <h1 className="loading-logo">SIGNBRIDGE</h1>
      
      {/* Container utama untuk tangan dan efeknya */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', width: '150px' }}>

        {/* Garis Gerak Kiri */}
        <motion.div
          className="motion-line"
          style={{ left: '20px' }} // Posisi awal di kiri
          variants={motionLineVariants}
          initial="hidden"
          animate={{
            // Muncul dan menghilang secara berulang
            opacity: [0, 1, 0, 0, 1, 0, 0],
            x: [-15, 0, -15, -15, 0, -15, -15],
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          (
        </motion.div>

        {/* Tangan yang Melambai */}
        <motion.div
          animate={{
            rotate: [0, 15, -10, 15, -5, 10, 0],
          }}
          transition={{
            duration: 3.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{
            transformOrigin: "80% 80%",
            // Pastikan tangan berada di lapisan paling atas
            zIndex: 10,
          }}
        >
          <Image
            src="/Asset Isyarat/handwave.svg"
            alt="Waving hand logo"
            width={120}
            height={120}
          />
        </motion.div>

        {/* Garis Gerak Kanan */}
        <motion.div
          className="motion-line"
          style={{ right: '20px' }} // Posisi awal di kanan
          variants={motionLineVariants}
          initial="hidden"
          animate={{
            opacity: [0, 1, 0, 0, 1, 0, 0],
            x: [15, 0, 15, 15, 0, 15, 15],
          }}
          transition={{
            duration: 3.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          )
        </motion.div>

      </div>
    </div>
  );
};

export default LoadingScreen;