import Plugin from 'src/plugin-system/plugin.class';

export default class SlidingPlugin extends Plugin {
    static options = {
        sliderEl: null,
        slidingSelector: '[data-initSlideImages="true"]',
        slidingRowSelector: '.slideimage-row-inside',
        slidingTrainSelector: '.train-row',
        slidingImageSelector: '.slideimage:first-child',
        slideButtonSelector: '.slide-button',
    };

    init() {
        const el = this;
        el.options.sliderCollection = document.querySelectorAll(el.options.slidingSelector);
        el.registerEvents();
    }
    registerEvents() {
        const el = this;
        el.options.sliderCollection.forEach((slider) => {
            slider.classList.add('hidebuttons');
            const sliderRow = slider.querySelector(el.options.slidingRowSelector);
            const trainRow = sliderRow.querySelector(el.options.slidingTrainSelector);
            const slideStep = 10;
            const containerWidth = slider.clientWidth;
            const scrollWidth = trainRow.scrollWidth;
            if (scrollWidth > containerWidth) {
                slider.classList.remove('hidebuttons');
                const buttonsList = slider.querySelectorAll(el.options.slideButtonSelector);
                buttonsList.forEach((button) => {
                    button.addEventListener('mouseenter', el.onMouseEnter.bind(this, slider));
                });
            }
        });
    }
    onMouseEnter(slider, event) {
        const el = this;
        const slideData = el.calculateSlide(slider, event.target);
        el.initiateTimeOut(slider, event.target);
    }

    initiateTimeOut(slider, button) {
        const el = this;
        let interval = setInterval(() => {
            let slideData = el.calculateSlide(slider, button);
            if(!slideData) {
                return;
            }
            const trainRow = slideData[0];
            const toTheLeft = slideData[1];
            trainRow.style.transform = 'translateX(' + toTheLeft + 'px)';
            trainRow.setAttribute('data-transform', parseInt(toTheLeft));
        }, 10);
        button.addEventListener('mouseleave', (e) => {
            clearInterval(interval);
        });
    }
    calculateSlide(slider, button) {
        const el = this;
        const sliderRow = slider.querySelector(el.options.slidingRowSelector);
        const trainRow = sliderRow.querySelector(el.options.slidingTrainSelector);
        const slideStep = 10;
        const containerWidth = slider.clientWidth;
        const scrollWidth = trainRow.scrollWidth;
        const translateXNumber = parseInt(trainRow.getAttribute('data-transform'));
        let translateXNumberForCalculation = translateXNumber;
        if(translateXNumber < 0) {
            translateXNumberForCalculation = translateXNumber * -1;
        }
        let toTheLeft = 0;
        if (scrollWidth > containerWidth) {
            const differenceWidth = scrollWidth - containerWidth;
            const distance = differenceWidth - translateXNumberForCalculation;
            switch (true) {
                case button.classList.contains('left-button'):
                    toTheLeft = translateXNumber + slideStep;
                    if (translateXNumber < 0) {
                        return [trainRow, toTheLeft];
                    }
                    break;
                case button.classList.contains('right-button'):
                    toTheLeft = translateXNumber + (slideStep * -1);
                    if (distance > 0) {
                        return [trainRow, toTheLeft];
                    }
                    break;
            }
        }
        return false;
    }
    extractNumber(value) {
        const match = value.match(/translateX\((\d+)px\)/);
        if (match) {
            const number = parseInt(match[1], 10);
            return number;
        } else {
            return 0;
        }
    }
    activateButton(button){
        button.classList.remove('hide');
    }
    deactivateButton(button){
        button.classList.add('hide');
    }
}