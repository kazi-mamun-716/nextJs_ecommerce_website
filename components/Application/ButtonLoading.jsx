import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const ButtonLoading = ({type, text, loading, className, onClick, ...props}) => {
  return (
    <div>
        <Button 
            type={type} 
            variant="outline" 
            disabled={loading} 
            onClick={onClick}
            className={cn("", className)}
            {...props}
        >
        {loading && <Spinner data-icon="inline-start" />}
        {text}
      </Button>
    </div>
  )
}

export default ButtonLoading