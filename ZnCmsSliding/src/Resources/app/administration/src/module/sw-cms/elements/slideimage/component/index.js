import template from './sw-cms-el-slideimage.html.twig';
import './sw-cms-el-slideimage.scss';

const { Mixin, Filter } = Shopware;


Shopware.Component.register('sw-cms-el-slideimage', {
    template,

    mixins: [
        'cms-element'
    ],
    
    computed: {
        displayModeClass() {
            if (this.element.config.displayMode.value === 'standard') {
                return null;
            }

            return `is--${this.element.config.displayMode.value}`;
        },
        mediaUrl() {
            const fallBackImageFileName = 'preview_mountain_large.jpg'
            const staticFallBackImage = this.assetFilter(`/administration/static/img/cms/${fallBackImageFileName}`);
            const elemData = this.element.data.media;
            const elemConfig = this.element.config.media;
            if (elemConfig.source === 'mapped') {
                const demoMedia = this.getDemoValue(elemConfig.value);

                if (demoMedia?.url) {
                    return demoMedia.url;
                }

                return staticFallBackImage;
            }
            if (elemConfig.source === 'default') {
                if(elemConfig?.value) {
                    const fileName = elemConfig.value.slice(elemConfig.value.lastIndexOf('/') + 1);
                    return this.assetFilter(`/administration/static/img/cms/${fileName}`);
                }
            }
            if (elemData?.id) {
                return this.element.data.media.url;
            }

            if (elemData?.url) {
                return this.assetFilter(elemConfig.url);
            }
            return staticFallBackImage;
        },

        assetFilter() {
            return Filter.getByName('asset');
        },

        mediaConfigValue() {
            return this.element?.config?.sliderItems?.value;
        },
        labelValue() {
            return this.element.config.label.value;
        },
        badge() {
            return this.element.config.badge.value;
        }
    },

    watch: {
        cmsPageState: {
            deep: true,
            handler() {
                this.$forceUpdate();
            },
        },

        mediaConfigValue(value) {
            const mediaId = this.element?.data?.media?.id;
            const isSourceStatic = this.element?.config?.media?.source === 'static';
            if (isSourceStatic && mediaId && value !== mediaId) {
                this.element.config.media.value = mediaId;
            }
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('slideimage');
            this.initElementData('slideimage');
        },
    }
});