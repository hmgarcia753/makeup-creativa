import React, { useState, useRef, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc
} from 'firebase/firestore';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDxTSW8qGI8kCLvadz_jHtWdoTRpY_V7D4",
  authDomain: "makeup-creativa.firebaseapp.com",
  projectId: "makeup-creativa",
  storageBucket: "makeup-creativa.firebasestorage.app",
  messagingSenderId: "503373993050",
  appId: "1:503373993050:web:7bd9c38445dbbceb50b463"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- CONFIGURACIÓN DE CLOUDINARY ---
const CLOUDINARY_CLOUD_NAME = "vpyfsy2o";
const CLOUDINARY_UPLOAD_PRESET = "hrgusnhu";

// --- ICONOS SVG ---
const IconCalendar = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const IconClock = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const IconSettings = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const IconLock = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>;
const IconTrash = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const IconCamera = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const IconWhatsApp = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const IconCheck = () => <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const IconTrendingUp = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;

// --- FUNCIONES AUXILIARES ---
const formatDuration = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h} h ${m} min`;
  if (h > 0) return `${h} h`;
  return `${m} min`;
};

const generateWhatsAppMessage = (name, service, date, time, magicLink) => {
  return `¡Hola, ${name}! 🌸 Gracias por elegir Makeup Creativa.\n\nTu cita está confirmada:\n💅 Servicio: ${service}\n📅 Fecha: ${date}\n⏰ Hora: ${time}\n\n✨ Para ver los detalles o modificar tu cita (máximo 1 cambio permitido), accede a tu enlace personal y seguro aquí: ${magicLink}\n\n¡Te esperamos!`;
};

const getCategoryColor = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('mano')) return 'bg-pink-400';
  if (cat.includes('pie')) return 'bg-blue-400';
  if (cat.includes('maquillaje')) return 'bg-purple-400';
  return 'bg-yellow-400';
};

const timeToMins = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const minsToTime = (mins) => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// Subida y compresión inteligente hacia Cloudinary
const compressAndUploadToCloudinary = (file, isSquareLogo = false) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (isSquareLogo) {
          canvas.width = 400;
          canvas.height = 400;
          const size = Math.min(img.width, img.height);
          const x = (img.width - size) / 2;
          const y = (img.height - size) / 2;
          ctx.drawImage(img, x, y, size, size, 0, 0, 400, 400);
        } else {
          const MAX_WIDTH = 800;
          const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        canvas.toBlob(async (blob) => {
          if (!blob) return reject(new Error("Error al comprimir imagen"));
          const formData = new FormData();
          formData.append('file', blob);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

          try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
              method: 'POST',
              body: formData
            });
            const data = await res.json();
            if (data.secure_url) {
              resolve(data.secure_url);
            } else {
              reject(new Error(data.error?.message || "Error subiendo a Cloudinary"));
            }
          } catch (err) {
            reject(err);
          }
        }, 'image/jpeg', 0.85);
      };
      img.onerror = () => reject(new Error("Archivo de imagen inválido"));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
};

const SafeImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  useEffect(() => { setError(false); }, [src]);

  if (error || !src) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-gray-300 font-serif font-bold text-2xl tracking-widest">mc</div>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

// --- DATOS BASE INICIALES (Para poblar la BD la primera vez) ---
const seedServices = [
  { category: 'Manos', name: 'Baño de gel + esmaltado semipermanente', durationMinutes: 140, price: 28000, img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400', desc: 'Limpieza profesional, baño de gel y esmaltado semipermanente.' },
  { category: 'Manos', name: 'Manicura Rusa', durationMinutes: 90, price: 22000, img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400', desc: 'Técnica en seco con torno para limpieza profunda.' },
  { category: 'Pies', name: 'Pedicura Spa', durationMinutes: 60, price: 25000, img: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=400', desc: 'Exfoliación, hidratación y esmaltado.' },
  { category: 'Maquillaje', name: 'Maquillaje Social', durationMinutes: 90, price: 45000, img: 'https://images.unsplash.com/photo-1512496015851-a1dc8a4731ea?auto=format&fit=crop&q=80&w=400', desc: 'Preparación de piel y pestañas postizas incluidas.' }
];

const defaultWorkingHours = {
  1: { isOpen: true, start: '17:00', end: '21:00' },
  2: { isOpen: true, start: '17:00', end: '21:00' },
  3: { isOpen: true, start: '17:00', end: '21:00' },
  4: { isOpen: true, start: '17:00', end: '21:00' },
  5: { isOpen: true, start: '17:00', end: '21:00' },
  6: { isOpen: true, start: '09:00', end: '20:00' },
  0: { isOpen: true, start: '09:00', end: '14:00' },
};

const themes = {
  gold: { name: 'Classic Gold', bg: 'bg-[#FAF8F5]', card: 'bg-white', text: 'text-gray-900', accent: 'bg-[#Cba85a]', accentText: 'text-[#Cba85a]', border: 'border-[#Cba85a]', isMetallic: true },
  halloween: { name: 'Halloween', bg: 'bg-[#1a1a1a]', card: 'bg-[#2a2a2a]', text: 'text-gray-100', accent: 'bg-[#ff6b00]', accentText: 'text-[#ff6b00]', border: 'border-[#ff6b00]', isMetallic: false },
  christmas: { name: 'Navidad', bg: 'bg-[#f4f7f6]', card: 'bg-white', text: 'text-gray-900', accent: 'bg-[#d42426]', accentText: 'text-[#d42426]', border: 'border-[#d42426]', isMetallic: false },
  pink: { name: 'Glam Pink', bg: 'bg-[#fff0f5]', card: 'bg-white', text: 'text-gray-900', accent: 'bg-[#ff1493]', accentText: 'text-[#ff1493]', border: 'border-[#ff1493]', isMetallic: false },
  minimal: { name: 'Minimalista', bg: 'bg-white', card: 'bg-gray-50', text: 'text-black', accent: 'bg-black', accentText: 'text-black', border: 'border-black', isMetallic: false }
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('1234');
  const [customLogo, setCustomLogo] = useState(null);
  
  const [currentTheme, setCurrentTheme] = useState('gold');
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);
  const [blocks, setBlocks] = useState([]);

  // Detectar si viene un enlace mágico de clienta (?cita=TOKEN)
  const [magicToken, setMagicToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('cita');
  });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // --- SINCRONIZACIÓN EN TIEMPO REAL CON FIREBASE ---
  useEffect(() => {
    const initAndSubscribe = async () => {
      try {
        const configRef = doc(db, 'settings', 'config');
        const configSnap = await getDoc(configRef);
        if (!configSnap.exists()) {
          await setDoc(configRef, {
            adminPassword: '1234',
            customLogo: null,
            currentTheme: 'gold',
            workingHours: defaultWorkingHours,
            seeded: true
          });
          for (const srv of seedServices) {
            await addDoc(collection(db, 'services'), srv);
          }
        }
      } catch (err) {
        console.error("Error inicializando Firestore:", err);
      }

      const unsubConfig = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.adminPassword) setAdminPassword(data.adminPassword);
          setCustomLogo(data.customLogo || null);
          if (data.currentTheme && themes[data.currentTheme]) setCurrentTheme(data.currentTheme);
          if (data.workingHours) setWorkingHours(data.workingHours);
        }
      });

      const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setServices(list);
        setLoading(false);
      });

      const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAppointments(list);
      });

      const unsubBlocks = onSnapshot(collection(db, 'blocks'), (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setBlocks(list);
      });

      return () => {
        unsubConfig();
        unsubServices();
        unsubAppointments();
        unsubBlocks();
      };
    };

    initAndSubscribe();
  }, []);

  const updateSettings = async (partial) => {
    try {
      await setDoc(doc(db, 'settings', 'config'), partial, { merge: true });
    } catch (err) {
      notify("Error al guardar configuración en la nube");
    }
  };

  const theme = themes[currentTheme] || themes.gold;

  const metallicStyles = theme.isMetallic ? `
    .metallic-bg {
      background: linear-gradient(135deg, #E6C875 0%, #B89033 25%, #F5DF96 50%, #B89033 75%, #E6C875 100%);
      background-size: 200% 200%;
      box-shadow: inset 0 0 10px rgba(255,255,255,0.4), 0 4px 6px rgba(0,0,0,0.1);
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      border: 1px solid #d4af37;
    }
    .metallic-text {
      background: linear-gradient(135deg, #B89033 0%, #D4AF37 50%, #997A24 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
    }
  ` : `
    .metallic-bg { background-color: ${theme.accent.replace('bg-', '')}; color: white; }
    .metallic-text { color: ${theme.accentText.replace('text-', '')}; }
  `;

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.text}`}>
        <style>{metallicStyles}</style>
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <span className="metallic-text text-3xl font-serif tracking-widest">mc</span>
        </div>
        <p className="text-sm opacity-60 font-medium">Cargando estudio...</p>
      </div>
    );
  }

  // Si la clienta entró con su enlace único (?cita=TOKEN)
  if (magicToken) {
    return (
      <div className={`min-h-screen font-sans ${theme.bg} ${theme.text}`}>
        <style>{metallicStyles}</style>
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl text-sm font-medium">
            {toast}
          </div>
        )}
        <ClientMagicManage
          token={magicToken}
          theme={theme}
          services={services}
          appointments={appointments}
          workingHours={workingHours}
          blocks={blocks}
          notify={notify}
          onExit={() => {
            window.history.replaceState({}, '', window.location.pathname);
            setMagicToken(null);
          }}
        />
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${theme.bg} ${theme.text}`}>
        <style>{metallicStyles}</style>
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl text-sm font-medium">
            {toast}
          </div>
        )}
        <div className={`${theme.card} p-8 rounded-2xl shadow-xl w-full max-w-sm border ${theme.border} text-center space-y-6`}>
          <div className="w-12 h-12 mx-auto flex items-center justify-center metallic-text">
            <IconLock />
          </div>
          <h2 className="text-2xl font-bold font-serif">Acceso Privado</h2>
          <p className="text-sm opacity-70">Ingresa tu clave para administrar el catálogo y la agenda.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (e.target.pwd.value === adminPassword) {
              setIsAdmin(true);
              setShowAuth(false);
            } else {
              notify('Clave incorrecta');
            }
          }} className="space-y-4">
            <input name="pwd" type="password" inputMode="numeric" placeholder="••••" required autoFocus className="w-full p-4 text-center text-2xl tracking-widest rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-[#Cba85a]" />
            <button type="submit" className="metallic-bg w-full py-3 rounded-xl font-bold text-white shadow-md">ENTRAR</button>
            <button type="button" onClick={() => setShowAuth(false)} className="text-sm font-bold opacity-60 mt-2">Cancelar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <style>{metallicStyles}</style>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl text-sm font-medium text-center max-w-[90vw]">
          {toast}
        </div>
      )}
      {isAdmin ? (
        <AdminPanel 
          theme={theme} 
          currentTheme={currentTheme} 
          setCurrentTheme={(t) => { setCurrentTheme(t); updateSettings({ currentTheme: t }); }}
          services={services}
          appointments={appointments}
          workingHours={workingHours}
          setWorkingHours={(wh) => { setWorkingHours(wh); updateSettings({ workingHours: wh }); }}
          blocks={blocks}
          adminPassword={adminPassword}
          setAdminPassword={(pwd) => { setAdminPassword(pwd); updateSettings({ adminPassword: pwd }); }}
          customLogo={customLogo}
          setCustomLogo={(logo) => { setCustomLogo(logo); updateSettings({ customLogo: logo }); }}
          notify={notify}
          onLogout={() => setIsAdmin(false)}
        />
      ) : (
        <ClientFlow 
          theme={theme} 
          services={services} 
          appointments={appointments}
          workingHours={workingHours}
          blocks={blocks}
          customLogo={customLogo}
          notify={notify}
          onAdminClick={() => setShowAuth(true)}
        />
      )}
    </div>
  );
}

// ==========================================
// VISTA AUTOGESTIÓN CLIENTA (?cita=TOKEN)
// ==========================================
function ClientMagicManage({ token, theme, services, appointments, workingHours, blocks, notify, onExit }) {
  const apt = appointments.find(a => a.token === token);
  const [rescheduling, setRescheduling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  const serviceObj = apt ? services.find(s => s.name === apt.service) : null;
  const durationMins = serviceObj ? serviceObj.durationMinutes : 60;

  useEffect(() => {
    if (rescheduling && newDate && apt) {
      const dateObj = new Date(newDate + 'T12:00:00');
      const dayOfWeek = dateObj.getDay();
      const schedule = workingHours[dayOfWeek];
      if (!schedule || !schedule.isOpen) {
        setAvailableSlots([]);
        return;
      }
      let slots = [];
      let currentMins = timeToMins(schedule.start);
      const endMins = timeToMins(schedule.end);

      while (currentMins + durationMins <= endMins) {
        const slotEnd = currentMins + durationMins;
        let overlap = false;

        // Revisar otras citas (excluyendo la suya propia)
        const dayApts = appointments.filter(a => a.date === newDate && a.id !== apt.id);
        for (let other of dayApts) {
          const oStart = timeToMins(other.time);
          const oSrv = services.find(s => s.name === other.service);
          const oEnd = oStart + (oSrv ? oSrv.durationMinutes : 60);
          if ((currentMins >= oStart && currentMins < oEnd) || (slotEnd > oStart && slotEnd <= oEnd) || (currentMins <= oStart && slotEnd >= oEnd)) {
            overlap = true;
          }
        }
        // Revisar bloqueos parciales
        const dayBlocks = blocks.filter(b => b.date === newDate && !b.isAllDay);
        for (let b of dayBlocks) {
          const bStart = timeToMins(b.startTime);
          const bEnd = timeToMins(b.endTime);
          if ((currentMins >= bStart && currentMins < bEnd) || (slotEnd > bStart && slotEnd <= bEnd) || (currentMins <= bStart && slotEnd >= bEnd)) {
            overlap = true;
          }
        }
        if (!overlap) slots.push(minsToTime(currentMins));
        currentMins += 30;
      }
      setAvailableSlots(slots);
    }
  }, [rescheduling, newDate, apt, appointments, services, workingHours, blocks, durationMins]);

  if (!apt) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h2 className="text-2xl font-serif font-bold">Cita no encontrada</h2>
        <p className="text-sm opacity-70">Este enlace puede haber expirado o la cita ya fue cancelada.</p>
        <button onClick={onExit} className="metallic-bg w-full py-4 rounded-xl font-bold text-white shadow-md">
          Ir a Makeup Creativa
        </button>
      </div>
    );
  }

  const handleConfirmReschedule = async () => {
    if (!newDate || !newTime) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'appointments', apt.id), {
        date: newDate,
        time: newTime,
        changesAvailable: 0
      });
      setRescheduling(false);
      notify("¡Tu cita ha sido reprogramada con éxito!");
    } catch (e) {
      notify("Error al reprogramar la cita");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAppointment = async () => {
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'appointments', apt.id));
      notify("Tu cita ha sido cancelada");
      onExit();
    } catch (e) {
      notify("Error al cancelar la cita");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="text-center pt-4">
          <p className="text-xs uppercase tracking-widest opacity-50 font-bold">Makeup Creativa</p>
          <h2 className="text-2xl font-serif font-bold mt-1">Gestión de tu Reserva</h2>
        </div>

        <div className={`${theme.card} p-5 rounded-2xl border ${theme.border} shadow-sm space-y-3`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase opacity-50">Clienta</span>
            <span className="font-bold">{apt.clientName}</span>
          </div>
          <div className="h-px bg-gray-100"></div>
          <div>
            <p className="text-xs font-bold uppercase opacity-50">Servicio</p>
            <p className="font-bold text-lg mt-0.5">{apt.service}</p>
          </div>
          <div className="h-px bg-gray-100"></div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold uppercase opacity-50">Fecha y Hora</p>
              <p className="font-bold metallic-text text-lg">{apt.date} • {apt.time}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase opacity-50">Valor</p>
              <p className="font-bold text-lg">${apt.price.toLocaleString('es-CL')}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl text-center text-xs font-medium mt-2">
            Cambios permitidos restantes: <span className="font-bold">{apt.changesAvailable} de 1</span>
          </div>
        </div>

        {apt.changesAvailable > 0 ? (
          !rescheduling ? (
            <div className="space-y-3">
              <button onClick={() => setRescheduling(true)} className="metallic-bg w-full py-4 rounded-xl font-bold text-white shadow-md">
                CAMBIAR FECHA U HORA (1 CAMBIO)
              </button>
              {!confirmCancel ? (
                <button onClick={() => setConfirmCancel(true)} className="w-full py-3 rounded-xl font-bold text-red-500 bg-red-50 border border-red-100 text-sm">
                  Cancelar cita
                </button>
              ) : (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center space-y-3">
                  <p className="text-sm font-bold text-red-700">¿Segura que deseas cancelar tu cita?</p>
                  <div className="flex space-x-2">
                    <button disabled={saving} onClick={handleCancelAppointment} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-bold text-sm">Sí, cancelar</button>
                    <button onClick={() => setConfirmCancel(false)} className="flex-1 bg-white text-gray-700 py-2.5 rounded-lg font-bold text-sm border">No, mantener</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`${theme.card} p-4 rounded-2xl border ${theme.border} space-y-4 shadow-sm`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Selecciona nueva fecha</h3>
                <button onClick={() => setRescheduling(false)} className="text-xs font-bold opacity-60 underline">Cancelar</button>
              </div>
              <div className="flex justify-between items-center">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="font-bold p-2">&lt;</button>
                <span className="font-bold capitalize text-sm">{currentMonth.toLocaleString('es', { month: 'long' })} {currentMonth.getFullYear()}</span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="font-bold p-2">&gt;</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['D','L','M','X','J','V','S'].map(d => <div key={d} className="font-bold opacity-50">{d}</div>)}
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const m = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
                  const y = currentMonth.getFullYear();
                  const dateStr = `${y}-${m}-${day.toString().padStart(2, '0')}`;
                  const today = new Date(); today.setHours(0,0,0,0);
                  const dObj = new Date(dateStr + 'T12:00:00');
                  const isPast = dObj < today;
                  const isBlocked = blocks.some(b => b.date === dateStr && b.isAllDay);
                  const isClosed = !workingHours[dObj.getDay()]?.isOpen;
                  const disabled = isPast || isBlocked || isClosed;
                  return (
                    <button key={day} disabled={disabled} onClick={() => { setNewDate(dateStr); setNewTime(''); }}
                      className={`p-2 rounded-full ${newDate === dateStr ? 'metallic-bg text-white font-bold' : disabled ? 'opacity-20' : 'hover:bg-gray-100'}`}>
                      {day}
                    </button>
                  );
                })}
              </div>
              {newDate && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold opacity-70">Horarios disponibles ({newDate}):</p>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map(t => (
                        <button key={t} onClick={() => setNewTime(t)}
                          className={`py-2.5 rounded-lg border text-xs font-bold ${newTime === t ? 'metallic-bg text-white border-transparent' : `${theme.border}`}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs opacity-60 text-center py-2">No hay bloques disponibles este día.</p>
                  )}
                </div>
              )}
              {newDate && newTime && (
                <button disabled={saving} onClick={handleConfirmReschedule} className="metallic-bg w-full py-3.5 rounded-xl font-bold text-white shadow-md">
                  {saving ? 'Guardando...' : 'CONFIRMAR NUEVA HORA'}
                </button>
              )}
            </div>
          )
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center space-y-2">
            <p className="text-sm font-bold text-amber-900">Ya utilizaste tu cambio permitido</p>
            <p className="text-xs text-amber-800">Si necesitas realizar otra modificación, comunícate directamente por WhatsApp con Makeup Creativa.</p>
          </div>
        )}
      </div>

      <button onClick={onExit} className="w-full py-3 text-sm font-bold opacity-60 underline mt-8">
        Volver a la página principal
      </button>
    </div>
  );
}

// ==========================================
// VISTA CLIENTE (FLUJO DE RESERVA)
// ==========================================
function ClientFlow({ theme, services, appointments, workingHours, blocks, customLogo, notify, onAdminClick }) {
  const [step, setStep] = useState(0); 
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const categories = [...new Set(services.map(s => s.category))];

  const isOverlapping = (dateStr, startMins, durationMins) => {
    const endMins = startMins + durationMins;
    const dayApts = appointments.filter(a => a.date === dateStr);
    for (let apt of dayApts) {
      const aptStart = timeToMins(apt.time);
      const aptSrv = services.find(s => s.name === apt.service);
      const aptEnd = aptStart + (aptSrv ? aptSrv.durationMinutes : 60);
      if ((startMins >= aptStart && startMins < aptEnd) || 
          (endMins > aptStart && endMins <= aptEnd) ||
          (startMins <= aptStart && endMins >= aptEnd)) return true;
    }
    const dayBlocks = blocks.filter(b => b.date === dateStr && !b.isAllDay);
    for (let b of dayBlocks) {
      const bStart = timeToMins(b.startTime);
      const bEnd = timeToMins(b.endTime);
      if ((startMins >= bStart && startMins < bEnd) || 
          (endMins > bStart && endMins <= bEnd) ||
          (startMins <= bStart && endMins >= bEnd)) return true;
    }
    return false;
  };

  useEffect(() => {
    if (step === 2 && selectedDate && selectedService) {
      const dateObj = new Date(selectedDate + 'T12:00:00');
      const dayOfWeek = dateObj.getDay();
      const schedule = workingHours[dayOfWeek];
      if (!schedule || !schedule.isOpen) {
        setAvailableSlots([]);
        return;
      }
      let slots = [];
      let currentMins = timeToMins(schedule.start);
      const endMins = timeToMins(schedule.end);
      const serviceDuration = selectedService.durationMinutes;

      while (currentMins + serviceDuration <= endMins) {
        if (!isOverlapping(selectedDate, currentMins, serviceDuration)) {
          slots.push(minsToTime(currentMins));
        }
        currentMins += 30; 
      }
      setAvailableSlots(slots);
    }
  }, [selectedDate, step, selectedService, workingHours, appointments, blocks]);

  const changeMonth = (offset) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newDate);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  if (successData) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <IconCheck />
        <h2 className="text-3xl font-serif font-bold">¡Reserva Registrada!</h2>
        <div className={`${theme.card} p-5 rounded-xl border ${theme.border} w-full text-left space-y-2 shadow-sm`}>
          <p className="text-sm opacity-70">Servicio</p>
          <p className="font-bold">{successData.service}</p>
          <div className="h-px w-full bg-gray-100 my-2"></div>
          <p className="text-sm opacity-70">Fecha y Hora</p>
          <p className="font-bold">{successData.date} a las {successData.time}</p>
        </div>
        <p className="text-sm opacity-80 mt-4 font-medium px-4">
          ¡Listo! En breve Makeup Creativa te enviará un mensaje de WhatsApp confirmando tu cita y tu enlace de acceso seguro.
        </p>
        <button onClick={() => { setSuccessData(null); setStep(0); setSelectedService(null); setSelectedDate(''); setSelectedTime(''); }} 
          className="metallic-bg w-full py-4 rounded-xl font-bold shadow-md mt-6 active:scale-95 transition-transform text-white">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto relative min-h-screen flex flex-col pb-32">
      {step === 0 && !successData && (
        <div className="absolute top-4 right-4 z-50">
          <button onClick={onAdminClick} className={`p-2 rounded-full backdrop-blur-md bg-opacity-20 ${theme.card} shadow-sm border border-gray-200 text-gray-500 hover:text-gray-800`}>
            <IconSettings />
          </button>
        </div>
      )}

      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 mt-20">
          <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white overflow-hidden relative">
             {customLogo ? (
               <img src={customLogo} alt="Logo" className="w-full h-full object-cover z-10" />
             ) : (
               <>
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/white-marble.png')]"></div>
                 <h1 className="metallic-text text-5xl font-serif tracking-widest z-10">mc</h1>
               </>
             )}
          </div>
          <div>
            <h2 className="text-3xl font-serif mb-2">Makeup Creativa</h2>
            <p className="text-sm opacity-70">Estudio de Belleza & Cuidado</p>
          </div>
          <button onClick={() => setStep(1)} className="metallic-bg text-white w-full py-4 rounded-xl font-bold tracking-wide transition-transform active:scale-95 shadow-md">
            RESERVAR AHORA
          </button>
        </div>
      )}

      {step > 0 && (
        <div className={`sticky top-0 z-40 ${theme.card} shadow-sm px-4 py-4 flex items-center`}>
          <button onClick={() => { setStep(step - 1); setSelectedTime(''); }} className="mr-4 font-bold text-xl">&larr;</button>
          <div className="flex-1 text-center font-medium">
            {step === 1 ? '1/3 Servicio' : step === 2 ? '2/3 Fecha' : '3/3 Tus datos'}
          </div>
          <div className="w-6"></div>
        </div>
      )}

      <div className="flex-1 p-4">
        {step === 1 && (
          <div className="space-y-4">
            {categories.map(cat => {
              const isOpen = openCategory === cat;
              const catServices = services.filter(s => s.category === cat);
              return (
                <div key={cat} className={`${theme.card} rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300`}>
                  <button onClick={() => setOpenCategory(isOpen ? null : cat)} className="w-full p-5 font-serif font-bold text-lg flex justify-between items-center">
                    <span>{cat} <span className="text-sm font-sans opacity-50 font-normal ml-2">({catServices.length})</span></span>
                    <span className="text-xl opacity-50 transform transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>↓</span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 space-y-6 bg-gray-50 border-t border-gray-100">
                      {catServices.map(s => (
                        <div key={s.id} className="flex flex-col space-y-3 bg-white p-3 rounded-xl shadow-sm">
                          <div className="h-48 rounded-lg overflow-hidden relative">
                            <SafeImage src={s.img} alt={s.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex justify-between items-start">
                            <div className="pr-4">
                              <h4 className="font-bold text-md leading-tight">{s.name}</h4>
                              <p className="text-xs opacity-60 mt-1">{formatDuration(s.durationMinutes)} | ${(s.price).toLocaleString('es-CL')}</p>
                              <p className="text-xs opacity-70 mt-2 line-clamp-2">{s.desc}</p>
                            </div>
                            <button onClick={() => { setSelectedService(s); setStep(2); }}
                              className={`text-xs px-4 py-2 rounded-lg font-bold shrink-0 shadow-sm ${selectedService?.id === s.id ? 'metallic-bg text-white' : `bg-gray-100 ${theme.text}`}`}>
                              ELEGIR
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className={`${theme.card} p-4 rounded-xl shadow-sm border border-gray-100`}>
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="font-bold p-2 hover:bg-gray-100 rounded-full">&lt;</button>
                <h3 className="font-bold capitalize">
                  {currentMonth.toLocaleString('es', { month: 'long' })} {currentMonth.getFullYear()}
                </h3>
                <button onClick={() => changeMonth(1)} className="font-bold p-2 hover:bg-gray-100 rounded-full">&gt;</button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['D','L','M','X','J','V','S'].map(d => <div key={d} className="font-bold opacity-50">{d}</div>)}
                {Array.from({length: getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())}).map((_, i) => {
                  const day = i + 1;
                  const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
                  const year = currentMonth.getFullYear();
                  const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`;
                  
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const thisDateObj = new Date(dateStr + 'T12:00:00');
                  const isPastDate = thisDateObj < today;

                  const dayOfWeek = thisDateObj.getDay();
                  const isBlockedAllDay = blocks.some(b => b.date === dateStr && b.isAllDay);
                  const isClosed = !workingHours[dayOfWeek]?.isOpen;
                  const isUnavailable = isBlockedAllDay || isClosed || isPastDate;
                  
                  return (
                    <button key={day} disabled={isUnavailable} onClick={() => { setSelectedDate(dateStr); setSelectedTime(''); }}
                      className={`p-2 rounded-full flex flex-col items-center justify-center transition-colors
                        ${selectedDate === dateStr ? 'metallic-bg text-white' : isUnavailable ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
                      <span>{day}</span>
                      {!isUnavailable && <span className="w-1 h-1 rounded-full bg-green-500 mt-1"></span>}
                      {isUnavailable && !isPastDate && <span className="w-1 h-1 rounded-full bg-red-500 mt-1"></span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="pb-10">
                <h4 className="font-bold mb-3">Horarios para el {selectedDate.split('-')[2]}</h4>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map(time => (
                      <button key={time} onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-lg border font-medium transition-colors shadow-sm text-sm
                          ${selectedTime === time ? 'metallic-bg border-transparent text-white' : `${theme.border} ${theme.text} bg-transparent`}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                    <p className="opacity-70 text-sm">No hay suficientes horas disponibles este día para la duración de este servicio ({formatDuration(selectedService.durationMinutes)}).</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm flex items-center shadow-sm">
              <IconClock /> <span className="ml-2">Mantendremos tu hora reservada por 10:00</span>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (submitting) return;
              setSubmitting(true);
              try {
                const token = Math.random().toString(36).substring(2, 8);
                const baseUrl = window.location.origin;
                const magicLink = `${baseUrl}/?cita=${token}`;
                const newApt = { 
                  clientName: e.target.name.value.trim(), 
                  phone: e.target.phone.value.trim(),
                  service: selectedService.name, 
                  serviceCategory: selectedService.category,
                  date: selectedDate, 
                  time: selectedTime, 
                  price: selectedService.price,
                  token,
                  magicLink,
                  changesAvailable: 1,
                  createdAt: new Date().toISOString()
                };
                await addDoc(collection(db, 'appointments'), newApt);
                setSuccessData(newApt);
              } catch (err) {
                notify("Error al guardar la reserva. Intenta nuevamente.");
              } finally {
                setSubmitting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold opacity-70 ml-1">Nombre completo</label>
                <input required name="name" type="text" className={`w-full p-3 rounded-xl border ${theme.border} bg-transparent outline-none mt-1 focus:ring-2 focus:ring-[#Cba85a] transition-all`} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-70 ml-1">Teléfono (WhatsApp)</label>
                <div className={`flex border ${theme.border} rounded-xl overflow-hidden mt-1 focus-within:ring-2 focus-within:ring-[#Cba85a] transition-all`}>
                  <div className="bg-gray-100 px-3 flex items-center font-bold text-gray-700">+56</div>
                  <input required name="phone" type="tel" className="w-full p-3 bg-transparent outline-none" placeholder="9 1234 5678" />
                </div>
              </div>
              <button disabled={submitting} type="submit" className="metallic-bg text-white w-full py-4 rounded-xl font-bold tracking-wide mt-6 shadow-md active:scale-95 transition-transform">
                {submitting ? 'AGENDANDO...' : 'CONFIRMAR RESERVA'}
              </button>
            </form>
          </div>
        )}
      </div>

      {step > 1 && selectedService && (
        <div className={`fixed bottom-0 left-0 right-0 p-4 border-t ${theme.border} metallic-bg shadow-2xl z-50 text-white`}>
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm font-bold truncate max-w-[200px]">{selectedService.name}</p>
              <p className="text-xs opacity-90">{selectedDate && selectedTime ? `${selectedDate} a las ${selectedTime}` : 'Seleccione hora'}</p>
            </div>
            <div className="font-bold text-lg">${(selectedService.price).toLocaleString('es-CL')}</div>
          </div>
          {step === 2 && selectedTime && (
            <button onClick={() => setStep(3)} className="w-full bg-white text-black py-3 rounded-lg font-bold mt-3 shadow-md active:scale-95 transition-transform">
              CONTINUAR
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// VISTA ADMIN: Panel de Gestión
// ==========================================
function AdminPanel({ theme, currentTheme, setCurrentTheme, services, appointments, workingHours, setWorkingHours, blocks, adminPassword, setAdminPassword, customLogo, setCustomLogo, notify, onLogout }) {
  const [tab, setTab] = useState('agenda');

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg}`}>
      <div className={`${theme.card} p-4 shadow-sm z-10 sticky top-0`}>
        <div className="flex justify-between items-center mb-4 pt-2">
           <h2 className="text-xl font-bold font-serif">Administración</h2>
           <button onClick={onLogout} className="text-xs font-bold bg-red-50 text-red-500 px-3 py-1.5 rounded-lg border border-red-100 shadow-sm active:scale-95 transition-transform">Salir</button>
        </div>
        <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
          {[
            { id: 'agenda', label: 'Agenda' },
            { id: 'catalogo', label: 'Catálogo' },
            { id: 'disponibilidad', label: 'Horarios' },
            { id: 'finanzas', label: 'Finanzas' },
            { id: 'diseno', label: 'Ajustes' }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm
                ${tab === t.id ? 'metallic-bg text-white' : 'bg-gray-100 text-gray-600'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {tab === 'agenda' && <AdminAgenda appointments={appointments} theme={theme} notify={notify} />}
        {tab === 'catalogo' && <AdminCatalog services={services} theme={theme} notify={notify} />}
        {tab === 'disponibilidad' && <AdminAvailability workingHours={workingHours} setWorkingHours={setWorkingHours} blocks={blocks} theme={theme} notify={notify} />}
        {tab === 'finanzas' && <AdminFinances appointments={appointments} theme={theme} />}
        {tab === 'diseno' && <AdminDesign currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} themes={themes} theme={theme} adminPassword={adminPassword} setAdminPassword={setAdminPassword} customLogo={customLogo} setCustomLogo={setCustomLogo} notify={notify} />}
      </div>
    </div>
  );
}

// SECCIÓN: FINANZAS Y TENDENCIAS
function AdminFinances({ appointments, theme }) {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('category'); 

  const filteredApts = appointments.filter(a => {
    if (!startDate && !endDate) return true;
    if (startDate && a.date < startDate) return false;
    if (endDate && a.date > endDate) return false;
    return true;
  });

  const totalRevenue = filteredApts.reduce((sum, a) => sum + a.price, 0);
  const totalCitas = filteredApts.length;

  const breakdown = {};
  filteredApts.forEach(a => {
    const key = viewMode === 'category' ? a.serviceCategory : a.service;
    if (!breakdown[key]) breakdown[key] = { count: 0, revenue: 0 };
    breakdown[key].count += 1;
    breakdown[key].revenue += a.price;
  });

  const sortedBreakdown = Object.entries(breakdown).sort((a, b) => b[1].revenue - a[1].revenue);

  return (
    <div className="space-y-6 pb-10">
      <div className={`${theme.card} p-5 rounded-xl shadow-sm border ${theme.border}`}>
        <h3 className="font-bold text-lg mb-4 flex items-center"><IconTrendingUp/><span className="ml-2">Filtro de Fechas</span></h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold opacity-70">Desde</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full p-2 rounded-lg border bg-gray-50 outline-none focus:border-[#Cba85a] mt-1 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold opacity-70">Hasta</label>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full p-2 rounded-lg border bg-gray-50 outline-none focus:border-[#Cba85a] mt-1 text-sm" />
          </div>
        </div>
      </div>

      <div className="metallic-bg p-5 rounded-xl shadow-md text-white flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90 font-medium">Total Generado</p>
          <h3 className="text-3xl font-bold">${totalRevenue.toLocaleString('es-CL')}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90 font-medium">Citas</p>
          <h3 className="text-3xl font-bold">{totalCitas}</h3>
        </div>
      </div>

      <div className={`${theme.card} p-5 rounded-xl shadow-sm border ${theme.border}`}>
         <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-lg">Análisis de Tendencias</h3>
           <div className="flex bg-gray-100 rounded-lg p-1">
             <button onClick={()=>setViewMode('category')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${viewMode==='category'?'bg-white shadow text-black':'text-gray-500'}`}>Categorías</button>
             <button onClick={()=>setViewMode('service')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${viewMode==='service'?'bg-white shadow text-black':'text-gray-500'}`}>Servicios</button>
           </div>
         </div>

         {sortedBreakdown.length === 0 ? (
            <p className="text-sm opacity-50 text-center py-4">No hay citas en este periodo.</p>
         ) : (
            <div className="space-y-3">
              {sortedBreakdown.map(([name, data]) => (
                <div key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-bold text-sm">{name}</p>
                    <p className="text-xs opacity-60">{data.count} cita{data.count !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right font-bold text-sm text-[#Cba85a]">
                    ${data.revenue.toLocaleString('es-CL')}
                  </div>
                </div>
              ))}
            </div>
         )}
      </div>
    </div>
  );
}

function AdminAgenda({ appointments, theme, notify }) {
  const [filterDate, setFilterDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filteredAppointments = filterDate ? appointments.filter(a => a.date === filterDate) : appointments;
  const displayAppointments = [...filteredAppointments].sort((a,b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return timeToMins(a.time) - timeToMins(b.time);
  });

  const changeMonth = (offset) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newDate);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const handleDeleteAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setConfirmDeleteId(null);
      notify("Cita eliminada de la agenda");
    } catch (e) {
      notify("Error al eliminar la cita");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className={`${theme.card} p-4 rounded-xl shadow-sm border ${theme.border}`}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="font-bold p-2 hover:bg-gray-100 rounded-full">&lt;</button>
          <h3 className="font-bold capitalize">
            {currentMonth.toLocaleString('es', { month: 'long' })} {currentMonth.getFullYear()}
          </h3>
          <button onClick={() => changeMonth(1)} className="font-bold p-2 hover:bg-gray-100 rounded-full">&gt;</button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['D','L','M','X','J','V','S'].map(d => <div key={d} className="font-bold opacity-50 pb-2">{d}</div>)}
          {Array.from({length: getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())}).map((_, i) => {
            const day = i + 1;
            const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
            const year = currentMonth.getFullYear();
            const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`;

            const dayApts = appointments.filter(a => a.date === dateStr);
            const isSelected = filterDate === dateStr;
            return (
              <button key={day} onClick={() => setFilterDate(isSelected ? null : dateStr)}
                className={`aspect-square flex flex-col items-center justify-start pt-2 rounded-lg transition-colors ${isSelected ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
                <span className={`font-bold ${isSelected ? 'text-black' : ''}`}>{day}</span>
                <div className="flex flex-wrap justify-center gap-0.5 mt-1 px-1">
                  {dayApts.map((apt, idx) => (<span key={idx} className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(apt.serviceCategory)}`}></span>))}
                </div>
              </button>
            )
          })}
        </div>
        <div className="flex justify-center space-x-3 mt-4 text-[10px] uppercase font-bold opacity-60">
           <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-pink-400 mr-1"></div>Manos</span>
           <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>Pies</span>
           <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-purple-400 mr-1"></div>Maquillaje</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
           <h3 className="font-bold text-lg">Citas Agendadas</h3>
           {filterDate && <button onClick={() => setFilterDate(null)} className="text-xs font-bold underline opacity-60">Ver todas</button>}
        </div>

        {displayAppointments.length === 0 ? (
          <p className="opacity-50 text-center py-8">No hay citas para mostrar en este día/mes.</p>
        ) : (
          <div className="space-y-3">
            {displayAppointments.map(apt => {
              const rawPhone = (apt.phone || '').replace(/\D/g, '');
              const wpUrlChat = `https://wa.me/56${rawPhone}`;
              const dynamicLink = apt.token ? `${window.location.origin}/?cita=${apt.token}` : apt.magicLink;
              const msg = generateWhatsAppMessage(apt.clientName, apt.service, apt.date, apt.time, dynamicLink);
              const wpUrlConfirm = `https://wa.me/56${rawPhone}?text=${encodeURIComponent(msg)}`;

              return (
                <div key={apt.id} className={`${theme.card} p-4 rounded-xl shadow-sm border-l-4 border-gray-200 space-y-3 relative overflow-hidden`}>
                  <div className={`absolute top-0 left-0 w-1 h-full ${getCategoryColor(apt.serviceCategory)}`}></div>
                  <div className="flex justify-between items-start pl-2">
                    <div>
                      <p className="font-bold text-lg">{apt.clientName}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-sm font-bold opacity-70">+56 {apt.phone}</p>
                        <a href={wpUrlChat} target="_blank" rel="noopener noreferrer" className="bg-green-50 text-green-500 p-1.5 rounded-full flex items-center justify-center transition-colors shadow-sm"><IconWhatsApp /></a>
                      </div>
                      <p className="text-sm opacity-70 mt-2">{apt.service}</p>
                    </div>
                    <div className="text-right flex flex-col items-end space-y-2">
                      <span className="font-bold text-lg">${apt.price.toLocaleString('es-CL')}</span>
                      {confirmDeleteId === apt.id ? (
                        <div className="flex space-x-1">
                          <button onClick={() => handleDeleteAppointment(apt.id)} className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold">Borrar</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(apt.id)} className="text-gray-400 hover:text-red-500 p-1" title="Eliminar cita">
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3 border-t border-gray-100 pt-3 mt-3 pl-2">
                    <div className="flex items-center text-sm font-medium metallic-text">
                      <IconCalendar /> <span className="ml-1 mr-3">{apt.date}</span>
                      <IconClock /> <span className="ml-1">{apt.time}</span>
                    </div>
                    <a href={wpUrlConfirm} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-lg text-sm font-bold shadow-md active:scale-95 transition-transform">
                      <IconWhatsApp /><span>Enviar confirmación</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCatalog({ services, theme, notify }) {
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [...new Set(services.map(s => s.category))];

  const handleSave = async (e) => {
    e.preventDefault();
    if (uploadingPhoto || savingService) return;
    const formData = new FormData(e.target);
    const totalMinutes = (parseInt(formData.get('hours') || 0) * 60) + parseInt(formData.get('minutes') || 0);
    const catForm = formData.get('category');
    const finalCategory = catForm === 'NUEVA' ? formData.get('newCategoryName').trim() : catForm;
    if (!finalCategory) return notify("Ingresa un nombre para la categoría");

    setSavingService(true);
    try {
      const existing = editingId ? services.find(s => s.id === editingId) : null;
      const servicePayload = {
        category: finalCategory,
        name: formData.get('name').trim(),
        price: parseInt(formData.get('price')),
        durationMinutes: totalMinutes,
        desc: formData.get('desc').trim(),
        img: previewImg || (existing ? existing.img : 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400')
      };

      if (isCreating) {
        await addDoc(collection(db, 'services'), servicePayload);
        notify("Servicio creado correctamente");
      } else {
        await updateDoc(doc(db, 'services', editingId), servicePayload);
        notify("Servicio actualizado");
      }
      setEditingId(null);
      setIsCreating(false);
      setPreviewImg(null);
    } catch (err) {
      notify("Error al guardar servicio en la nube");
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      setEditingId(null);
      notify("Servicio eliminado");
    } catch (e) {
      notify("Error al eliminar servicio");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const secureUrl = await compressAndUploadToCloudinary(file, false);
      setPreviewImg(secureUrl);
      notify("Foto subida y optimizada");
    } catch (err) {
      notify("Error al subir la foto: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const ServiceForm = ({ s = {} }) => {
    const [catSel, setCatSel] = useState(s.category || categories[0] || 'NUEVA');
    return (
      <form onSubmit={handleSave} className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h4 className="font-bold text-center border-b pb-2">{isCreating ? 'Nuevo Servicio' : 'Editar Servicio'}</h4>
        <div className="text-center">
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
          <div onClick={() => !uploadingPhoto && fileInputRef.current.click()} className="w-full h-32 bg-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden relative border-2 border-dashed border-gray-400">
            {(previewImg || s.img) && <SafeImage src={previewImg || s.img} alt="Preview" className="w-full h-full object-cover opacity-60" />}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white font-bold drop-shadow-md">
               <IconCamera />
               <span className="mt-2 text-sm">{uploadingPhoto ? 'Subiendo a la nube...' : 'Cambiar foto'}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold opacity-70">Categoría</label>
          <select name="category" value={catSel} onChange={e=>setCatSel(e.target.value)} className="w-full p-2 border-b bg-transparent outline-none mt-1 font-bold focus:border-[#Cba85a]">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="NUEVA">+ Crear Nueva Categoría</option>
          </select>
          {catSel === 'NUEVA' && <input name="newCategoryName" placeholder="Nombre de la nueva categoría" required className="w-full p-2 border-b bg-transparent outline-none mt-2 border-[#Cba85a]" autoFocus />}
        </div>
        <div>
          <label className="text-xs font-bold opacity-70">Nombre del servicio</label>
          <input name="name" defaultValue={s.name} required className="w-full p-2 border-b bg-transparent outline-none mt-1 focus:border-[#Cba85a]" />
        </div>
        <div>
          <label className="text-xs font-bold opacity-70">Precio (CLP)</label>
          <input name="price" type="number" defaultValue={s.price} required className="w-full p-2 border-b bg-transparent outline-none mt-1 focus:border-[#Cba85a]" />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-xs font-bold opacity-70">Horas</label>
            <input name="hours" type="number" min="0" defaultValue={s.durationMinutes ? Math.floor(s.durationMinutes / 60) : 1} className="w-full p-2 border-b bg-transparent outline-none mt-1 focus:border-[#Cba85a]" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold opacity-70">Minutos</label>
            <input name="minutes" type="number" min="0" max="59" step="5" defaultValue={s.durationMinutes ? s.durationMinutes % 60 : 0} className="w-full p-2 border-b bg-transparent outline-none mt-1 focus:border-[#Cba85a]" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold opacity-70">Descripción</label>
          <textarea name="desc" defaultValue={s.desc} rows="2" className="w-full p-2 border rounded-lg bg-transparent outline-none mt-1 text-sm focus:border-[#Cba85a]"></textarea>
        </div>
        <div className="flex space-x-2 pt-2">
          <button disabled={uploadingPhoto || savingService} type="submit" className="flex-1 metallic-bg py-3 rounded-lg font-bold text-sm text-white shadow-md disabled:opacity-50">
            {savingService ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={() => { setEditingId(null); setIsCreating(false); setPreviewImg(null); }} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold text-sm">Cancelar</button>
        </div>
        {!isCreating && s.id && (
          <button type="button" onClick={() => handleDeleteService(s.id)} className="w-full text-xs text-red-500 font-bold underline pt-2">
            Eliminar este servicio
          </button>
        )}
      </form>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg pl-2">Catálogo</h3>
        <button onClick={() => { setIsCreating(true); setEditingId(null); setPreviewImg(null); }} className="text-sm font-bold bg-white px-4 py-2 rounded-lg shadow-sm metallic-text">+ Nuevo</button>
      </div>

      {isCreating && <div className={`${theme.card} rounded-xl shadow-sm border ${theme.border} p-1 mb-4`}><ServiceForm /></div>}

      {services.map(s => (
        <div key={s.id} className={`${theme.card} rounded-xl p-4 shadow-sm border ${theme.border} ${editingId === s.id ? 'ring-2 ring-[#Cba85a]' : ''}`}>
          {editingId === s.id ? (
            <ServiceForm s={s} />
          ) : (
            <div className="flex space-x-4 items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0"><SafeImage src={s.img} alt="img" className="w-full h-full object-cover" /></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{s.category}</p>
                <p className="font-bold leading-tight mt-0.5">{s.name}</p>
                <p className="text-sm opacity-70 mt-1">${s.price.toLocaleString('es-CL')} • {formatDuration(s.durationMinutes)}</p>
              </div>
              <button onClick={() => { setEditingId(s.id); setIsCreating(false); setPreviewImg(null); }} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminAvailability({ workingHours, setWorkingHours, blocks, theme, notify }) {
  const [tab, setTab] = useState('horarios');
  const dayNames = { 1:'Lunes', 2:'Martes', 3:'Miércoles', 4:'Jueves', 5:'Viernes', 6:'Sábado', 0:'Domingo' };
  const [date, setDate] = useState('');
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [reason, setReason] = useState('');

  const handleUpdateSchedule = (day, field, value) => {
    setWorkingHours({ ...workingHours, [day]: { ...workingHours[day], [field]: value } });
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!date) return notify("Selecciona una fecha");
    try {
      await addDoc(collection(db, 'blocks'), {
        date,
        isAllDay,
        startTime: isAllDay ? null : startTime,
        endTime: isAllDay ? null : endTime,
        reason: reason.trim()
      });
      setDate('');
      setReason('');
      notify("Bloqueo guardado");
    } catch (err) {
      notify("Error al guardar bloqueo");
    }
  };

  const handleDeleteBlock = async (id) => {
    try {
      await deleteDoc(doc(db, 'blocks', id));
      notify("Bloqueo eliminado");
    } catch (err) {
      notify("Error al eliminar bloqueo");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
         <button onClick={() => setTab('horarios')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab==='horarios' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>Horario Semanal</button>
         <button onClick={() => setTab('excepciones')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab==='excepciones' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>Fechas Específicas</button>
      </div>

      {tab === 'horarios' && (
        <div className="space-y-4">
          <p className="text-sm opacity-70 px-2 mb-2">Define tus días de trabajo y horarios. Los días cerrados bloquearán todos esos días del año.</p>
          {[1,2,3,4,5,6,0].map(day => {
            const h = workingHours[day] || { isOpen: false, start: '09:00', end: '18:00' };
            return (
              <div key={day} className={`${theme.card} p-4 rounded-xl shadow-sm border ${theme.border} flex flex-col space-y-3`}>
                <div className="flex justify-between items-center">
                   <h4 className="font-bold">{dayNames[day]}</h4>
                   <div className="flex items-center space-x-2">
                     <span className="text-xs font-bold opacity-60 uppercase">{h.isOpen ? 'Abierto' : 'Cerrado'}</span>
                     <button onClick={() => handleUpdateSchedule(day, 'isOpen', !h.isOpen)} className={`w-12 h-6 rounded-full relative transition-colors ${h.isOpen ? 'metallic-bg' : 'bg-gray-300'}`}>
                       <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${h.isOpen ? 'translate-x-6' : 'translate-x-1'}`}></div>
                     </button>
                   </div>
                </div>
                {h.isOpen && (
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                    <div>
                      <label className="text-xs font-bold opacity-60">Apertura</label>
                      <input type="time" value={h.start} onChange={(e) => handleUpdateSchedule(day, 'start', e.target.value)} className="w-full p-2 rounded-lg border bg-gray-50 text-sm mt-1 outline-none focus:border-[#Cba85a]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-60">Cierre</label>
                      <input type="time" value={h.end} onChange={(e) => handleUpdateSchedule(day, 'end', e.target.value)} className="w-full p-2 rounded-lg border bg-gray-50 text-sm mt-1 outline-none focus:border-[#Cba85a]" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'excepciones' && (
        <div className="space-y-6">
          <div className={`${theme.card} p-5 rounded-xl shadow-sm border ${theme.border}`}>
            <h3 className="font-bold text-lg mb-4">Bloquear Fecha Especial</h3>
            <p className="text-sm opacity-70 mb-4">Usa esto para vacaciones o trámites puntuales que se superponen a tu horario normal.</p>
            <form onSubmit={handleAddBlock} className="space-y-4">
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-3 rounded-lg border bg-gray-50 outline-none focus:border-[#Cba85a]" />
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm font-bold text-gray-700">¿Bloquear TODO el día?</span>
                <button type="button" onClick={() => setIsAllDay(!isAllDay)} className={`w-12 h-6 rounded-full relative transition-colors ${isAllDay ? 'metallic-bg' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isAllDay ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
              </div>
              {!isAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full p-3 rounded-lg border bg-gray-50 outline-none focus:border-[#Cba85a]" />
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full p-3 rounded-lg border bg-gray-50 outline-none focus:border-[#Cba85a]" />
                </div>
              )}
              <input type="text" placeholder="Motivo (Opcional)" value={reason} onChange={e => setReason(e.target.value)} className="w-full p-3 rounded-lg border bg-gray-50 outline-none focus:border-[#Cba85a]" />
              <button type="submit" className="metallic-bg w-full py-3 rounded-lg font-bold text-white shadow-md active:scale-95 transition-transform">GUARDAR BLOQUEO</button>
            </form>
          </div>
          <div>
            <h4 className="font-bold mb-3">Excepciones Activas</h4>
            <div className="space-y-3">
              {blocks.length === 0 && <p className="opacity-50 text-sm italic">No hay bloqueos específicos creados.</p>}
              {blocks.map(b => (
                <div key={b.id} className={`${theme.card} p-3 rounded-lg flex justify-between items-center shadow-sm border-l-4 border-red-500`}>
                  <div>
                    <p className="font-bold text-sm">{b.date}</p>
                    <p className="text-xs opacity-70 mt-1">{b.isAllDay ? 'Día completo' : `${b.startTime} a ${b.endTime}`} {b.reason && ` • ${b.reason}`}</p>
                  </div>
                  <button onClick={() => handleDeleteBlock(b.id)} className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"><IconTrash /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDesign({ currentTheme, setCurrentTheme, themes, theme, adminPassword, setAdminPassword, customLogo, setCustomLogo, notify }) {
  const logoInputRef = useRef(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const secureUrl = await compressAndUploadToCloudinary(file, true);
      setCustomLogo(secureUrl);
      notify("Logotipo actualizado en la nube");
    } catch (err) {
      notify("Error al subir el logo: " + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className={`${theme.card} p-5 rounded-xl shadow-sm border ${theme.border}`}>
         <h3 className="font-bold text-lg mb-4 flex items-center"><IconLock /> <span className="ml-2">Seguridad del Panel</span></h3>
         <form onSubmit={(e) => { e.preventDefault(); setAdminPassword(e.target.newpwd.value); notify('Clave actualizada correctamente'); }} className="space-y-3">
            <label className="text-sm font-bold opacity-70">Nueva Clave Numérica</label>
            <input name="newpwd" type="text" pattern="[0-9]*" defaultValue={adminPassword} required className="w-full p-3 rounded-lg border bg-gray-50 tracking-widest font-mono text-lg outline-none focus:ring-2 focus:ring-[#Cba85a]" />
            <button type="submit" className="w-full py-3 rounded-lg font-bold bg-gray-900 text-white shadow-md active:scale-95 transition-transform">Actualizar Clave</button>
         </form>
      </div>

      <div className={`${theme.card} p-5 rounded-xl shadow-sm border ${theme.border}`}>
         <h3 className="font-bold text-lg mb-4 flex items-center"><IconCamera /> <span className="ml-2">Logotipo Principal</span></h3>
         <p className="text-sm opacity-70 mb-4">Esta imagen reemplazará el círculo con las letras "mc" en la portada de tu aplicación.</p>
         <div className="text-center">
            <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleLogoUpload} />
            <div onClick={() => !uploadingLogo && logoInputRef.current.click()} className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex flex-col items-center justify-center cursor-pointer overflow-hidden relative border-4 border-dashed border-gray-300 shadow-inner">
               {uploadingLogo ? (
                 <span className="text-xs font-bold opacity-70 px-3">Subiendo...</span>
               ) : customLogo ? (
                 <img src={customLogo} alt="Logo" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-sm font-bold opacity-50 px-4">Subir Logo</span>
               )}
            </div>
            {customLogo && <button onClick={() => { setCustomLogo(null); notify("Logo restaurado"); }} className="mt-4 text-xs font-bold text-red-500 underline">Restaurar logo original (mc)</button>}
         </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Apariencia de Color</h3>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(themes).map(([key, t]) => (
            <button key={key} onClick={() => { setCurrentTheme(key); notify(`Tema cambiado a ${t.name}`); }} className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all ${currentTheme === key ? theme.border : 'border-transparent bg-gray-50'}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full shadow-inner ${key === 'gold' ? 'metallic-bg' : t.accent}`}></div>
                <div className="text-left"><p className="font-bold">{t.name}</p></div>
              </div>
              {currentTheme === key && <div className="w-6 h-6 rounded-full metallic-bg text-white flex items-center justify-center font-bold">✓</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
