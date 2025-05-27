// Configuración de la API
export const API_CONFIG = {
    // IP base para desarrollo
    BASE_URL: 'http://192.168.137.225:4000/api',
    
    // Endpoints
    ENDPOINTS: {
        CIUDADANOS: '/Ciudadanos',
        INCIDENCIAS: '/Incidencias',
        DEPENDENCIAS: '/Dependencias',
        CATEGORIAS: '/Categorias',
        NOTIFICACIONES: '/Notificaciones',
        REPORTES: '/Incidencias',
        UPLOAD_IMAGE: '/upload'
    }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para actualizar la IP base (útil si necesitas cambiar la IP en runtime)
export const updateBaseUrl = (newIp: string) => {
    API_CONFIG.BASE_URL = `http://${newIp}:4000/api`;
}; 