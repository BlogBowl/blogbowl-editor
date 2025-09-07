import { cn } from '@/lib/utils';

type DividerProps = {
    className?: string;
};

const Divider = ({ className }: DividerProps) => {
    return <div className={cn('w-full h-px bg-gray-200', className)}></div>;
};

export default Divider;
