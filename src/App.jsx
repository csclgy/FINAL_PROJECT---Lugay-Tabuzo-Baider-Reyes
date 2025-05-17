import image from './assets/image.png'
function App() {

  return (
    <section className="min-h-screen flex
    items-center justify-center font-popp
    bg-gradient-to-r from-[#0f172a]  to-[#334155]">

      <div className="flex shadow-2xl">
        <div className="flex flex-col items-center
        justify-center text-center p-20 gap-8
        bg-white rounded-2xl
        
        xl:rounded-tr-none xl:rounded-br-none">

          <h1 className="text-5xl font-bold text-gradie">Login</h1>
          

          <div className="flex flex-col text-2xl
          text-left gap-1">
            <span>Username</span>
            <input type="text" className="rounded-md
            p-1 border-2 outline-none
            focus:border-cyan-400 focus:bg-slate-50"/>
          </div>

          <div className="flex flex-col text-2xl
          text-left gap-1">
            <span>Password</span>
            <input type="password" 
            className="rounded-md p-1 border-2 outline-none
            focus:border-cyan-400 focus:bg-slate-50"/>
          
          </div>
          <button className="
            px-10 py-2 text-2x1 rounded-md
            bg-gradient-to-b from-[#f59e0b] to-yellow-500
            hover:from-[#f59e0b] hover:to-[#ea580c]
            text-white font-bold">LOGIN</button>

            

            <p className="font-semibold">Don't have an account?  
              <a href="#" className="p-1
              text-blue-400 hover:underline
              ">Register</a></p>
          </div>
        </div>
        <img src={image} alt="" className='
          w-[420px] object-cover xl:rounded-tr-2xl
          xl:rounded-br-2xl
          xl:block hidden'/>
    </section>
    
  )
}

export default App
