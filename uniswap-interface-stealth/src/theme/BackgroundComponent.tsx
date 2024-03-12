import React, { useEffect, useRef, useState, ReactNode } from 'react';

const loadedScripts: { [key: string]: boolean } = {};

const useScript = (url: string, onLoaded: () => void) => {
  useEffect(() => {
    console.log(`Checking if script ${url} is already loaded.`);
    if (loadedScripts[url]) {
      console.log(`Script ${url} is already loaded.`);
      onLoaded();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = () => {
      loadedScripts[url] = true; // 标记脚本为已加载
      onLoaded(); // 执行回调函数
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, onLoaded]);
};

type VantaEffect = {
  destroy: () => void;
} | null;

const BackgroundComponent = ({ children }: { children: ReactNode }) => {
  const [vantaEffect, setVantaEffect] = useState<VantaEffect>(null);
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState({ three: false, vanta: false });

  useScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js", () => {
    setScriptsLoaded(prev => prev.three ? prev : { ...prev, three: true });
  });

  useScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js", () => {
    setScriptsLoaded(prev => prev.vanta ? prev : { ...prev, vanta: true });
  });

  useEffect(() => {
    if (scriptsLoaded.three && scriptsLoaded.vanta && !vantaEffect && window.VANTA && vantaRef.current) {
      const effect = window.VANTA.BIRDS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
      });
      setVantaEffect(effect as VantaEffect);
    }

    // 返回的清理函数将在组件卸载时调用，也会在依赖项改变导致effect重新执行前调用
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [scriptsLoaded.three, scriptsLoaded.vanta]);

  return <div ref={vantaRef} style={{ height: '100vh' }}>{children}</div>;
};

export default BackgroundComponent;


// import React, { useEffect, useRef, useState, ReactNode } from 'react';

// type VantaEffect = {
//   destroy: () => void;
// } | null;

// const useScript = (url: string, onLoaded: () => void) => {
//   useEffect(() => {
//     // 检查脚本是否已经加载
//     const existingScript = document.querySelector(`script[src="${url}"]`);
//     if (!existingScript) {
//       const script = document.createElement('script');
//       script.src = url;
//       script.async = true;

//       script.onload = () => onLoaded(); // Execute callback when script is loaded
//       document.body.appendChild(script);

//       return () => {
//         document.body.removeChild(script);
//       };
//     } else {
//       // 如果脚本已经存在，则直接调用onLoaded回调
//       onLoaded();
//     }
//     // 确保所有路径都有返回值。如果脚本已存在，返回一个空的清理函数。
//     return () => {};
//   }, [url, onLoaded]);
// };

// const BackgroundComponent = ({ children }: { children: ReactNode }) => {
//   const [vantaEffect, setVantaEffect] = useState<VantaEffect>(null);
//   const vantaRef = useRef<HTMLDivElement | null>(null);
//   const [scriptsLoaded, setScriptsLoaded] = useState({ three: false, vanta: false });

//   useScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js", () => {
//     setScriptsLoaded((prev) => ({ ...prev, three: true }));
//   });
//   useScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js", () => {
//     setScriptsLoaded((prev) => ({ ...prev, vanta: true }));
//   });

//   useEffect(() => {
//     if (!vantaEffect && scriptsLoaded.three && scriptsLoaded.vanta && window.VANTA && vantaRef.current) {
//       const effect = window.VANTA.BIRDS({
//         el: vantaRef.current,
//         mouseControls: true,
//         touchControls: true,
//         gyroControls: false,
//         minHeight: 200.00,
//         minWidth: 200.00,
//         scale: 1.00,
//         scaleMobile: 1.00
//       }) as VantaEffect;
//       setVantaEffect(effect);
//     }
//   }, [scriptsLoaded.three, scriptsLoaded.vanta, vantaEffect]); // 优化依赖项

//   // Cleanup function to destroy Vanta effect when component unmounts or updates
//   useEffect(() => {
//     return () => {
//       if (vantaEffect) {
//         vantaEffect.destroy();
//       }
//     };
//   }, [vantaEffect]); // 仅在vantaEffect改变时运行清理函数

//   return (
//     <div ref={vantaRef} style={{ height: '100vh' }}>
//       {children}
//     </div>
//   );
// };

// export default BackgroundComponent;

