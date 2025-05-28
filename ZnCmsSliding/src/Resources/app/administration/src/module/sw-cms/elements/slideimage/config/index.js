import template from './sw-cms-el-config-slideimage.html.twig';
import './sw-cms-el-config-slideimage.scss';


Shopware.Component.register('sw-cms-el-config-slideimage', {
    template,

    mixins: [
        'cms-element'
    ],

    data() {
        return {
            mediaModalIsOpen: false,
            initialFolderId: null,
        };
    },

    computed: {
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        uploadTag() {
            return `cms-element-media-config-${this.element.id}`;
        },

        previewSource() {
            if (this.element?.data?.media?.id) {
                return this.element.data.media;
            }
            return this.element.config.media.value;
        },
        media: {
            get() {
                return this.element.config.media.value;
            },

            set(value) {
                console.log(value);
                this.element.config.media.value = value;
            }
        },
        label: {
            get() {
                return this.element.config.label.value;
            },
            set(value) {
                this.element.config.label.value = value;
            }
        },
        labelPosition: {
            get() {
                return this.element.config.labelPosition.value;
            },
            set(value) {
                this.element.config.labelPosition.value = value;
            }
        },
        url: {
            get() {
                return this.element.config.url.value;
            },
            set(value) {
                this.element.config.url.value = value;
            }
        },
        position: {
            get() {
                return this.element.config.position.value;
            },
            set(value) {
                this.element.config.position.value = value;
            }
        },
        hex: {
            get() {
                return this.element.config.hex.value;
            },
            set(value) {
                this.element.config.hex.value = value;
            }
        },
        badge: {
            get() {
                return this.element.config.badge.value;
            },
            set(value) {
                this.element.config.badge.value = value;
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('slideimage');
        },

        onLabelUpdate(value) {
            this.element.config.label.value = value;
            this.$emit('element-update', this.element);
        },
        onLabelPositionUpdate(value) {
            this.element.config.labelPosition.value = value;
            this.$emit('element-update', this.element);
        },
        onPositionUpdate(position) {
            this.element.config.position.value = position;
            this.$emit('element-update', this.element);
        },
        onUrlUpdate(value) {
            this.element.config.url.value = value;
            this.$emit('element-update', this.element);
        },
        onHexUpdate(hex) {
            this.element.config.hex.value = hex;
            this.$emit('element-update', this.element);
        },
        onBadgeUpdate(badge) {
            this.element.config.badge.value = badge;
            this.$emit('element-update', this.element);
        },
        onPositionUpdate(position) {
            this.element.config.position.value = position;
            this.$emit('element-update', this.element);
        },
        async onImageUpload({ targetId }) {
            const mediaEntity = await this.mediaRepository.get(targetId);
            this.element.config.media.value = mediaEntity.id;
            this.element.config.media.source = 'static';
            this.updateElementData(mediaEntity);

            this.$emit('element-update', this.element);
        },

        onImageRemove() {
            this.element.config.media.value = null;

            this.updateElementData();

            this.$emit('element-update', this.element);
        },

        onCloseModal() {
            this.mediaModalIsOpen = false;
        },

        onSelectionChanges(mediaEntity) {
            const media = mediaEntity[0];
            this.element.config.media.value = media.id;
            this.element.config.media.source = 'static';
            this.updateElementData(media);
            this.$emit('element-update', this.element);
        },

        updateElementData(media = null) {
            const mediaId = media === null ? null : media.id;
            if (!this.element.data) {
                this.$set(this.element, 'data', { mediaId, media });
            } else {
                this.$set(this.element.data, 'mediaId', mediaId);
                this.$set(this.element.data, 'media', media);
            }
        },

        onOpenMediaModal() {
            this.mediaModalIsOpen = true;
        },

        onMinHeightUpdate(value) {
            this.element.config.minHeight.value = value === null ? '' : value;
            this.$emit('element-update', this.element);
        },
        onVerticalAlignUpdate(value) {
            this.element.config.verticalAlign.value = value === null ? '' : value;
        },

        onDisplayModeUpdate(value) {
            if (value === 'cover') {
                this.element.config.verticalAlign.value = null;
            }
            this.element.config.displayMode.value = value;
            this.$emit('element-update', this.element);
        },
    }
});