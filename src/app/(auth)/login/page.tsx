import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://media.licdn.com/dms/image/v2/D5612AQE_5CarCIR0Gg/article-cover_image-shrink_720_1280/B56ZW0apKUGQAI-/0/1742488651163?e=2147483647&v=beta&t=WtUJhRNncjjz9j6Anu8Fe4z7-Vne_QnJrHGQjnUrL0I')`,
      }}
    >
      {/* Ambient dark filter to enhance foreground glass panel legibility */}
      <div className="absolute inset-0 bg-slate-800/50 backdrop-brightness-75" />

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
