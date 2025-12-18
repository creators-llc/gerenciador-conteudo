<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        width?: string;
        position?: 'left' | 'right' | 'top' | 'bottom';
        placename?: string;
        showHeader?: boolean;
    }>(),
    {
        width: '500px',
        position: 'right',
        showHeader: true,
        placename: 'Detalhes da Análise',
    },
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'close'): void;
}>();

const isOpen = computed(() => props.modelValue);
const positionClass = computed(() => `c-menu-offcanvas--${props.position}`);
const transitionName = computed(() => `slide-${props.position}`);

// Métodos
const close = () => {
    emit('update:modelValue', false);
    emit('close');
};

// Bloquear scroll do corpo quando aberto
watch(isOpen, (val) => {
    if (val) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

onUnmounted(() => {
    document.body.style.overflow = '';
});
</script>

<template>
    <div>
        <transition name="fade">
            <div v-if="isOpen" class="c-menu-overlay" @click="close"></div>
        </transition>

        <transition :name="transitionName">
            <div
                v-if="isOpen"
                class="c-menu-offcanvas"
                :style="{ width: width }"
                :class="positionClass"
            >
                <div v-if="showHeader" class="c-menu-header">
                    <h3 class="text-xl font-bold text-text-main m-0">
                        {{ placename }}
                    </h3>
                    <button
                        class="c-menu-close hover:bg-gray-100 rounded-full p-1"
                        @click="close"
                        type="button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-text-secondary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div class="c-menu-content px-6 pt-6 pb-24">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.c-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.c-menu-offcanvas {
    position: fixed;
    background-color: var(--color-background);
    z-index: 1000;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    transition: transform 0.3s ease-in-out;
}

.c-menu-offcanvas--right {
    top: 0;
    right: 0;
    height: 100%;
}

.c-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
}

/* Animações */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
    transform: translateX(100%);
}
</style>
