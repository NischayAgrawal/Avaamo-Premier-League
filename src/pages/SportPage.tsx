import {
  useParams,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Trophy, BookOpen, Calendar, Image } from "lucide-react";
import { useYear } from "../context/YearContext";
import * as THREE from "three";

function SportPage() {
  const { sportName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedYear } = useYear();
  const [animationLoaded, setAnimationLoaded] = useState(false);

  const formattedSportName = sportName
    ?.split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const tabs = [
    {
      path: "leaderboard",
      label: "Leaderboard",
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      path: "match-facts",
      label: "Matches",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      path: "match-rules",
      label: "Rules",
      icon: <BookOpen className="w-5 h-5" />,
    },
    { path: "gallery", label: "Gallery", icon: <Image className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (location.pathname === `/sport/${sportName}`) {
      navigate("leaderboard");
    }
  }, [location.pathname, navigate, sportName]);

  // Initialize the 3D background animation
  useEffect(() => {
    // Create scene only once when component mounts
    if (document.getElementById("three-bg")) return;

    const container = document.createElement("div");
    container.id = "three-bg";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.zIndex = "-1";
    container.style.opacity = "0.3";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;

    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    // Blue particles to match the color scheme
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color(0x1e40af),
      transparent: true,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    setAnimationLoaded(true);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (container && document.body.contains(container)) {
        container.removeChild(renderer.domElement);
        document.body.removeChild(container);
      }
    };
  }, []);

  return (
    <div
      className={`container mx-auto px-6 py-12 space-y-12 max-w-6xl transition-opacity duration-1000 ${
        animationLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-start">
        <Link
          to="/"
          className="group inline-flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:scale-105"
        >
          <span className="bg-blue-50 p-2 rounded-full mr-3 group-hover:bg-blue-100 transition-all duration-300 shadow-md">
            <ArrowLeft className="w-5 h-5" />
          </span>
          <span className="text-lg font-medium">Back to Home</span>
        </Link>

        <div className="w-full flex justify-center mt-6">
          <h1
            className="text-5xl font-bold text-gray-900 relative perspective-1000"
            style={{
              transform: "perspective(1000px)",
              transformStyle: "preserve-3d",
            }}
          >
            <span
              className="relative z-10 inline-block animate-float"
              style={{
                animation: "float 3s ease-in-out infinite",
                textShadow: "2px 2px 0 rgba(0,0,0,0.1)",
              }}
            >
              {formattedSportName}
            </span>
            <span className="absolute -bottom-3 left-0 right-0 h-3 bg-blue-100 z-0 opacity-70 rounded-full transform -rotate-1"></span>
            <style jsx>{`
              @keyframes float {
                0% {
                  transform: translateY(0px) rotateX(0deg);
                }
                50% {
                  transform: translateY(-10px) rotateX(2deg);
                }
                100% {
                  transform: translateY(0px) rotateX(0deg);
                }
              }
            `}</style>
          </h1>
        </div>
      </div>

      <nav className="flex justify-center overflow-x-auto py-2">
        <div
          className="inline-flex items-center p-2 bg-gray-50 rounded-xl shadow-lg"
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(249, 250, 251, 0.8)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 flex items-center gap-2
                ${
                  location.pathname.includes(tab.path)
                    ? "bg-blue-600 text-white shadow-md transform scale-105 hover:scale-110"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600 hover:shadow-md hover:scale-105"
                }
              `}
              style={{
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {tab.icon}
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <div
        className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transform transition-all duration-500"
        style={{
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          transform: "perspective(1000px) rotateX(1deg)",
          transformOrigin: "top center",
          background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
        }}
      >
        <Outlet context={{ sportName, selectedYear }} />
      </div>
    </div>
  );
}

export default SportPage;
