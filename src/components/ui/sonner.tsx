import { useTheme } from "../../contexts/ThemeContext"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle2, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme === "dark" ? "dark" : "light"}
      className="toaster group"
      icons={{
        success: (
          <CheckCircle2 className="size-4" />
        ),
        info: (
          <Info className="size-4" />
        ),
        warning: (
          <AlertTriangle className="size-4" />
        ),
        error: (
          <XCircle className="size-4" />
        ),
        loading: (
          <Loader2 className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--toast-bg)",
          "--normal-text": "var(--color-text-primary)",
          "--normal-border": "var(--toast-border)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
