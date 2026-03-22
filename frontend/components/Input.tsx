type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input className={`border rounded px-3 h-10 ${className}`} {...props} />
  );
}
