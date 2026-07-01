interface SeparatorProps {
   children?: React.ReactNode
   className?: string
}

export function Separator({ children, className }: SeparatorProps) {
   return (
      <div className={`flex items-center ${className ?? ''}`}>
         <div className="flex-1 border-t border-beige-2" />
         {children && (
            <span className="mx-3 text-xs text-[#E2CDBF]">{children}</span>
         )}
         <div className="flex-1 border-t border-beige-2" />
      </div>
   )
}
