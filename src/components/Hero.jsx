import bannerImage from "../../public/images/Homepage-Hero-BG.webp";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import { useEffect } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/Chat");
    }
  }, [user, navigate]);

  const signUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("User Logged in", result.user);
      // Make sure your authContext is properly updating with this user
      navigate("/Chat"); // Navigate after successful login
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }
  
  return (
    <section className="relative min-h-[calc(100vh-50px)] overflow-hidden md:py-[10rem] rounded-bl-3xl rounded-br-3xl opacity-85"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className="bsolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] ">
        <div className="col-span-1 flex h-full items-center justify-center" />
        <div className="dark:border-dark-border col-span-1 flex h-full items-center justify-center border-x border-white/10" />
        <div className="col-span-1 flex h-full items-center justify-center" />
      </div>
      <figure className="bg-accent-500/40 pointer-events-none absolute -bottom-[70%] left-1/2 z-0 block aspect-square w-[520px] -translate-x-1/2 rounded-full blur-[200px]" />
      <figure className="bg-surface-primary dark:bg-dark-surface-primary pointer-events-none absolute left-[4vw] top-[64px] z-20 hidden aspect-square w-[32vw] rounded-full opacity-50 blur-[100px] md:block" />
      <figure className="bg-surfce-primary dark:bg-dark-surface-primary pointer-events-none absolute bottom-[-50px] right-[7vw] z-20 hidden aspect-square w-[30vw] rounded-full opacity-50 blur-[100px] md:block" />
      <div className="dark:divide-dark-border relative z-10 flex flex-col divide-y divide-black/10 pt-[35px]">
        <div className="flex flex-col items-center justify-end">
          <div className="dark:border-dark-border flex items-center gap-2 !border !border-b-0 border-black/5 px-4 py-2">
            <p className="text-text-tertiary dark:text-dark-text-tertiary text-sm tracking-tight"></p>
          </div>
        </div>
        <div>
          <div className="mx-auto flex h-[288px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-2 px-2 py-4 sm:px-10 lg:px-24">
            <h1 className="text-text-primary dark:text-dark-text-primary text-pretty text-center text-5xl  sm:text-5xl md:text-6xl  lg:text-[clamp(50px,7vw,75px)] font-medium leading-none tracking-[-1.44px] md:max-w-screen-lg md:tracking-[-2.16px] text-white" style={{
              background: 'linear-gradient(135deg, rgb(209 141 95), #B48CDE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Develop your second brain.
            </h1>
            <h2 className="text-md text-text-tertiary mb-4 dark:text-dark-text-tertiary max-w-2xl text-pretty text-center md:text-lg text-white">
              Long Term Memory for your whole domain Workstream.
            </h2>
            <div className="flex justify-center items-center gap-4">
              <button   onClick={() => window.open('https://github.com/pratyushdev-codes/SecondMemory.ai_Extension', '_blank')}  className="text-base flex flex-row text-ascent-1 gap-2 px-4 md:px-4 py-1 md:py-2 border border-[#666] rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
                  <path d="M439-82q-76-8-141.5-42.5t-113.5-88Q136-266 108.5-335T81-481q0-155 102.5-268.5T440-880v80q-121 17-200 107.5T161-481q0 121 79 211.5T439-162v80Zm40-198L278-482l57-57 104 104v-245h80v245l103-103 57 58-200 200Zm40 198v-80q43-6 82.5-23t73.5-43l58 58q-47 37-101 59.5T519-82Zm158-652q-35-26-74.5-43T520-800v-80q59 6 113 28.5T733-792l-56 58Zm112 506-56-57q26-34 42-73.5t22-82.5h82q-8 59-30 113.5T789-228Zm8-293q-6-43-22-82.5T733-677l56-57q38 45 61 99.5T879-521h-82Z" />
                </svg>
                Download Chrome Extension
              </button>
              <button onClick={signUp} className="text-base flex flex-row text-ascent-1 gap-2 px-4 md:px-4 py-1 md:py-2 border border-[#666] rounded-full text-white">
                Sign up 
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#D9D9D9">
                  <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                </svg> 
              </button>
            </div>
          </div>
        </div>

        <div className=" dark:divide-dark-border flex items-start justify-center divide-y divide-black/10  px-8 sm:px-24">
          <div className="flex w-full max-w-[80vw] flex-col items-center justify-start md:!max-w-[392px]">
            <a href="/docs" className="cursor-pointer w-full"></a>
          </div>
        </div>
        <div className="mx-auto max-w-7xl">
          <AnimatedLogoCloud />
        </div>
      </div>
    </section>
  );
};

export default Hero;

const logos = [
  // Logo array remains the same - removed for brevity
];

const AnimatedLogoCloud = () => {
  return (
    <div className="w-full py-12">
      <div className="mx-auto w-full px-4 md:px-8">
        <div
          className="group relative mt-6 flex gap-6 overflow-hidden p-2"
          style={{
            maskImage:
              "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
          }}
        >
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex shrink-0 animate-x-slider flex-row justify-around gap-6"
              >
                {logos.map((logo, key) => (
                  <img
                    key={key}
                    src={logo.url}
                    className="h-10 w-28 px-2 flex-none brightness-0  dark:invert"
                    alt={logo.name}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};