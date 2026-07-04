import { twMerge } from 'tailwind-merge';
import { mergeProps } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ptViewMerge = (globalPTProps = {} as any, selfPTProps = {} as any, datasets: any) => {
    const { class: globalClass, ...globalRest } = globalPTProps;
    const { class: selfClass, ...selfRest } = selfPTProps;

    return mergeProps({ class: twMerge(globalClass, selfClass) }, globalRest, selfRest, datasets);
};
