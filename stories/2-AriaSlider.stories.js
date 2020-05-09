import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

// import MyButton from './MyButton';
import AriaSlider from '../src/lib-components/input/AriaSlider';

export default {
  title: 'AriaSlider',
  component: AriaSlider,
};

// props: ["min", "max", "value", "showProgressBar", "showTicks", "showPlusOnValueLabel"],

export const NoProps = () => ({
  components: { AriaSlider },
  template:

  `
  <div style="padding:75px; border:1px solid black;"
    >
    <AriaSlider>
    </AriaSlider>
  </div>
  `,
  methods: { action: action('clicked') },
});

export const TypicalUseCase = () => ({
  components: { AriaSlider },
  template:

  `
  <div style="padding:75px; border:1px solid black;"
    >
    <AriaSlider 
      min="1"
      max="19"
      value="7">
    </AriaSlider>
  </div>
  `,
  methods: { action: action('clicked') },
});

export const ActualInputRange = () => ({
  components: { AriaSlider },
  template:

  `
  <div style="padding:75px; border:1px solid black;"
    >
    <input type="range">
    </input>
  </div>
  `,
  methods: { action: action('clicked') },
});