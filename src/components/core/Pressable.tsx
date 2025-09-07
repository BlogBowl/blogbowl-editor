import { ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip.tsx';

type PressableProps = {
    children: ReactNode;
    onPress: () => void;
    tooltip?: string;
};

const Pressable = ({ children, onPress, tooltip }: PressableProps) => {
    if (!tooltip) {
        return (
            <div
                className={
                    'hover:opacity-70 active:opacity-50 cursor-pointer p-1 hover:bg-gray-100 rounded-md text-muted-foreground'
                }
                onClick={onPress}
            >
                {children}
            </div>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={
                            'hover:opacity-70 active:opacity-50 cursor-pointer p-1 hover:bg-gray-100 rounded-md hover:text-black text-muted-foreground'
                        }
                        onClick={onPress}
                    >
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className={'text-xs text-gray-400'}>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Pressable;
