<template>
    <Accordion
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </Accordion>
</template>

<script setup lang="ts">
// @ts-nocheck -- вендорный код Volt/PrimeVue, из typecheck исключён (см. tsconfig.json)
import Accordion, { type AccordionPassThroughOptions, type AccordionProps } from 'primevue/accordion';
import { ref } from 'vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ AccordionProps {}
defineProps<Props>();

const theme = ref<AccordionPassThroughOptions>({
    root: ``
});
</script>
