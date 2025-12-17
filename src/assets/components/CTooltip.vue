<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';

// Definição das Props (Baseado no seu arquivo txt)
const props = withDefaults(
    defineProps<{
        text: string;
        position?: 'top' | 'bottom' | 'left' | 'right';
        showIconInfo?: boolean;
        delay?: number;
        disabled?: boolean;
        theme?: 'dark' | 'light';
    }>(),
    {
        position: 'top',
        showIconInfo: true,
        delay: 200,
        disabled: false,
        theme: 'dark',
    },
);

// Estado
const isVisible = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

// Classes Dinâmicas
const tooltipClasses = computed(() => [
    `tooltip-${props.position}`,
    `tooltip-${props.theme}`,
]);

const tooltipStyles = computed(() => ({
    animationDelay: `${props.delay}ms`,
}));

// Métodos
const showTooltip = () => {
    if (props.disabled) return;
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        isVisible.value = true;
    }, props.delay);
};

const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    isVisible.value = false;
};

// Limpeza
onBeforeUnmount(() => {
    if (timeoutId) clearTimeout(timeoutId);
});
</script>

<template>
    <div
        class="c-tooltip tooltip-container"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
        @focus="showTooltip"
        @blur="hideTooltip"
    >
        <slot></slot>

        <span
            v-if="showIconInfo"
            class="cursor-pointer ml-2 text-gray-400 hover:text-gray-600"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 inline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        </span>

        <div
            v-if="isVisible"
            class="tooltip"
            :class="tooltipClasses"
            :style="tooltipStyles"
        >
            {{ text }}
            <div class="tooltip-arrow" :class="`arrow-${position}`"></div>
        </div>
    </div>
</template>

<style scoped>
/* Converti o SCSS para CSS padrão para garantir compatibilidade */
.tooltip-container {
    position: relative;
    display: inline-flex; /* Ajuste para alinhar texto e ícone */
    align-items: center;
}

.tooltip {
    position: absolute;
    z-index: 1000;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 500;
    white-space: normal; /* Permite quebra de linha se o texto for longo */
    width: max-content;
    max-width: 250px; /* Limite de largura */
    pointer-events: none;
    opacity: 0;
    animation: fadeIn 0.2s ease-out forwards;
}

/* Posições */
.tooltip-top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
}
.tooltip-bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
}
.tooltip-left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 8px;
}
.tooltip-right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 8px;
}

/* Temas */
.tooltip-dark {
    background-color: #333;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.tooltip-light {
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Setas */
.tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
}

/* Setas Dark */
.tooltip-dark .arrow-top {
    bottom: -6px;
    left: 50%;
    margin-left: -6px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #333;
}
.tooltip-dark .arrow-bottom {
    top: -6px;
    left: 50%;
    margin-left: -6px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #333;
}

/* Animação */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(4px);
    } /* Ajuste leve */
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}
</style>
