<script setup lang="ts">
import { ref } from 'vue';
import UploadForm from './assets/components/UploadForm.vue';
//import OffCanvas from './assets/components/OffCanva.vue';

const menuOffCanvasOpen = ref(false);

const apiResponse = ref<any>(null);

const handleUploadSucess = (data: any) => {
    console.log('App recebeu sucesso:', data);
    apiResponse.value = data;
};

const handleUploadError = (error: any) => {
    console.error('App recebeu erro:', error);
    apiResponse.value = {
        error: 'Falha no upload. Veja o console para mais detalhes.',
    };
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 py-10 px-4">
        <header class="max-w-4xl mx-auto mb-8 text-center">
            <h1 class="text-3xl font-bold text-gray-800">Creators Agent POC</h1>
            <p class="text-gray-500 mt-2">
                Ambiente de teste de Upload e Feedback
            </p>
        </header>

        <main class="max-w-4xl mx-auto space-y-8">
            <UploadForm
                @upload-success="handleUploadSucess"
                @upload-error="handleUploadError"
            />
            <OffCanvas
                :value="menuOffCanvasOpen"
                @input="menuOffCanvasOpen = $event"
                position="right"
                >Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Dolorum vitae excepturi maiores.
            </OffCanvas>

            <div
                v-if="apiResponse"
                class="bg-gray-400 text-green-400 p-6 rounded-lg shadow-lg overflow-auto"
            >
                <h3 class="text-white font-bold border-b border-gray-600 pb-2">
                    Resposta da API (Debug):
                </h3>
                <pre class="text-xs">
                    {{ apiResponse }}
                </pre>
            </div>
        </main>
    </div>
</template>
