import './component';
import './config';
import './preview';

Shopware.Service('cmsService').registerCmsElement({
    name: 'slideimage',
    label: 'sw-cms.elements.slideimage.label',
    component: 'sw-cms-el-slideimage',
    configComponent: 'sw-cms-el-config-slideimage',
    previewComponent: 'sw-cms-el-preview-slideimage',
    defaultConfig: {
        media: {
            source: 'static',
            value: null,
            entity: {
                name: 'media',
            },
        },
        label: {
            source: 'static',
            value: 'do slide',
        },
        labelPosition: {
            source: 'static',
            value: 'top',
        },
        displayMode: {
            source: 'static',
            value: 'standard',
        },
        newTab: {
            source: 'static',
            value: false,
        },
        url: {
            source: 'static',
            value: null,
        },
        minHeight: {
            source: 'static',
            value: '140px',
        },
        verticalAlign: {
            source: 'static',
            value: null,
        },
        position: {
            source: 'static',
            value: 0,
        },
        hex: {
            source: 'static',
            value: "#ff0000",
        },
        badge: {
            source: 'static',
            value: ''
        }
    }
});