<?php declare(strict_types=1);

namespace Zn\CmsSliding\Core\Content\Media\Cms;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\FieldConfig;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\EntityResolverContext;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Content\Cms\SalesChannel\Struct\ImageStruct;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;

class ImageCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'slideimage';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $config = $slot->getFieldConfig();
        $mediaConfig = $config->get('media');
        if (!$mediaConfig || $mediaConfig->isMapped() || $mediaConfig->getValue() === null || $mediaConfig->getSource() === 'default') {
            return null;
        }

        $criteria = new Criteria([$mediaConfig->getValue()]);

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $config = $slot->getFieldConfig();
        $image = new ImageStruct();
        $slot->setData($image);

        if ($urlConfig = $config->get('url')) {
            if ($urlConfig->isStatic()) {
                $image->setUrl($urlConfig->getValue());
            }

            if ($urlConfig->isMapped() && $resolverContext instanceof EntityResolverContext) {
                $url = $this->resolveEntityValue($resolverContext->getEntity(), $urlConfig->getValue());
                if ($url) {
                    $image->setUrl($url);
                }
            }

            if ($newTabConfig = $config->get('newTab')) {
                $image->setNewTab($newTabConfig->getValue());
            }
        }

        $mediaConfig = $config->get('media');
        if ($mediaConfig && $mediaConfig->getValue()) {
            $this->addMediaEntity($slot, $image, $result, $mediaConfig, $resolverContext);
        }
    }

    private function addMediaEntity(CmsSlotEntity $slot, ImageStruct $image, ElementDataCollection $result, FieldConfig $config, ResolverContext $resolverContext): void
    {
        if ($config->isMapped() && $resolverContext instanceof EntityResolverContext) {
            /** @var MediaEntity|null $media */
            $media = $this->resolveEntityValue($resolverContext->getEntity(), $config->getValue());

            if ($media !== null) {
                $image->setMediaId($media->getUniqueIdentifier());
                $image->setMedia($media);
            }
        }

        if ($config->isStatic()) {
            $image->setMediaId($config->getValue());

            $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
            if (!$searchResult) {
                return;
            }

            /** @var MediaEntity|null $media */
            $media = $searchResult->get($config->getValue());
            if (!$media) {
                return;
            }

            $image->setMedia($media);
        }
    }
}