<!-- 

TODO doc, and reference https://www.w3.org/TR/wai-aria-practices/examples/slider/slider-1.html

-->

<template>

  <div
    class="aria-slider"
    ref="wrapper">

    <div
      class="slider-rail"
      ref="rail"
      @click="handleRailClick">

      <div
        class="slider-thumb"
        ref="thumb"
        role="slider"
        tabindex="0"
        @mousedown="handleMouseDown"
        @touchdown="handleMouseDown"
        @keydown="handleKeyDown"
        :aria-valuemin="valueMin"
        :aria-valuenow="valueNow"
        :aria-valuemax="valueMax">

        <div
          class="slider-thumb-tooltip">
          <span>
            {{valueNow}}
          </span>
          <span
            v-if="showPlusOnValueLabel">+</span>
        </div>
      </div>

      <div
        v-if="showProgressBar"
        class="slider-rail-progress-bar"
        ref="progressBar">
      </div>

      <div
        class="slider-tick"
        v-if="showTicks"
        v-for="tick in ticks"
        :style="'left: ' + tick.xPosition + 'px'">
      </div>

    </div>

  </div>

</template>

<script>

  // Use the same default values as <input type="range">
  const DefaultValues = Object.freeze({
    Min   : 0,
    Max   : 100,
    Value : 50
  });

  const KeyCodes = Object.freeze({
    'Left': 37,
    'Up': 38,
    'Right': 39,
    'Down': 40,
    'PageUp': 33,
    'PageDown': 34,
    'End': 35,
    'Home': 36
  });

  export default {
    props: ["min", "max", "value", "showProgressBar", "showTicks", "showPlusOnValueLabel"],

    data() {
      return {
        valueMin          : "",
        valueMax          : "",
        valueNow          : "",
        ticks             : [],
        tickIncrement     : 0,

        // TODO: refactor in light of that this now exists
        currentTickIndex  : -1
      };
    },

    // TODO: this should run on props change!
    created() {
      this.valueMin = this.min    === undefined ? DefaultValues.Min   : this.min;
      this.valueMax = this.max    === undefined ? DefaultValues.Max   : this.max;
      this.valueNow = this.value  === undefined ? DefaultValues.Value : this.value;
    },

    mounted() {

      // Initialize component, which involves measuring widths, doing math, applying styles etc
      this.initialize();

      // NOTE: this will NOT work in IE11, or in iOS Safari < 13.4, or in... ???
      //
      // Not really psyched on polyfilling it right now, but may be needed in the future.
      if (window.ResizeObserver) {
        // When dimensions change, reinitialize the component
        const resizeObserver = new ResizeObserver(() => {
          this.initialize();
        });
        resizeObserver.observe(this.$refs.wrapper);
      }
    },

    methods: {

      initialize() {

        // Tick increment is the width of the rail divided by the number of spaces
        // between ticks
        this.tickIncrement = this.getRailWidth() / (this.valueMax - this.valueMin);

        this.ticks = [];

        // Draw ticks
        for(let i = 0; i <= this.valueMax - this.valueMin; ++i) {
          const value = Number(this.valueMin) + i;
          const tick = {
            xPosition   : this.tickIncrement * i,
            value       : value
          };
          this.ticks.push(tick);

          if (tick.value === Number(this.valueNow)) {
            this.currentTickIndex = i;
          }

        }

        if (this.currentTickIndex === -1) {
          this.currentTickIndex = 0;
        }

        const startingTick = this.ticks[this.currentTickIndex];

        this.moveThumbTo(startingTick);
        this.setValueNow(startingTick.value);
      },

      getRailWidth() {
        return this.$refs.rail.getBoundingClientRect().width;
      },

      getThumbWidth() {
        return this.$refs.thumb.getBoundingClientRect().width;
      },

      getValueSpan() {
        return this.valueMax - this.valueMin;
      },

      /**
       * Get the nearest tick to the given xOffset
       */
      getTickFromXOffset(xOffset) {

        // We come at this backwards...

        // First, round the xOffset to the nearest tick position
        const nearestTickPosition
          = Math.round(xOffset / this.tickIncrement) * this.tickIncrement;

        // Thinking of ticks as indexed values starting at zero, compute the index
        // of that tick position
        const nearestTickIndex = nearestTickPosition / this.tickIncrement;

        return this.ticks[nearestTickIndex];
      },

      getMouseEventXOffset(event) {
        return event.pageX - this.$refs.rail.getBoundingClientRect().x;
      },

      moveThumbTo(tick) {
        const thumbXPosition = tick.xPosition - (this.getThumbWidth() / 2);
        this.$refs.thumb.style.left = thumbXPosition + 'px';

        if (this.showProgressBar) {
          this.$refs.progressBar.style.width = tick.xPosition + 'px';
        }
      },

      setValueNow(value) {
        this.valueNow = value;
      },

      dispatchChange() {

        // TODO STYLE: make this more like a proper change event? Hmm.
        this.$emit('change', {
            value       : this.valueNow
          }
        );
      },

      //
      // Event Handlers
      //

      handleRailClick(event) {
        const xOffset = this.getMouseEventXOffset(event);
        const nearestTick = this.getTickFromXOffset(xOffset);

        if (nearestTick) {
          this.moveThumbTo(nearestTick);
          this.setValueNow(nearestTick.value);
          this.dispatchChange();
        }
      },

      handleMouseDown(event) {

        this.$refs.thumb.focus();

        event.preventDefault();

        const railWidth = this.getRailWidth();
        const initialValueNow = this.valueNow;

        function handleMouseMove (event) {

          if (!this.$refs.rail) {
            return;
          }

          // Current mouse position x, in pixels, relative to the left side of the rail
          // const xOffset = event.pageX - this.$refs.rail.getBoundingClientRect().x;

          const xOffset = this.getMouseEventXOffset(event);
          const nearestTick = this.getTickFromXOffset(xOffset);

          if (nearestTick) {
            this.moveThumbTo(nearestTick);
            this.setValueNow(nearestTick.value);
          }

        }

        let boundMouseMove = handleMouseMove.bind(this);
        let boundMouseUp = handleMouseUp.bind(this);

        function handleMouseUp (event) {
          document.removeEventListener('mousemove', boundMouseMove);
          document.removeEventListener('mouseup',   boundMouseUp);

          document.removeEventListener('touchmove', boundMouseMove);
          document.removeEventListener('touchup',   boundMouseUp);

          // Only dispatch the change event if the value really changed...
          // so if e.g. user starts on '2', moves to '3', moves back to '2',
          // and only then lets go of the mouse, then don't notify change
          // because nothing really changed.

          if (this.valueNow !== initialValueNow) {
            this.dispatchChange();
          }

        }

        document.addEventListener('mousemove',  boundMouseMove);
        document.addEventListener('mouseup',    boundMouseUp);

        document.addEventListener('touchmove',  boundMouseMove);
        document.addEventListener('touchup',    boundMouseUp);

      },

      handleKeyDown(event) {

        const keyCode = event.target.keyCode;

        switch(keyCode) {

          case KeyCodes.Up:
          case KeyCodes.Right:
            // TODO: Increase slider value one step
            break;

          case KeyCodes.Left:
          case KeyCodes.Down:
            // TODO: Decrease slider value one step
            break;

          case KeyCodes.PageUp:
            // TODO: Increase slider value multiple steps (use discretion for length of step)
            break;

          case KeyCodes.PageDown:
            // TODO: Decrease slider value multiple steps (use discretion for length of step)
            break;

          case KeyCodes.End:
            // TODO: Set slider value to max
            break;

          case KeyCodes.Home:
            // TODO: Set slider value to min
            break;

          default:
            // Do nothing.
        }

      }

    }
  };

</script>

<style>

.slider {
  position          : relative;
}
.slider-rail {
  /*width             : 100px;*/
  /*width             : 100%;*/
  position          : relative;
  background-color  : black;
  height            : 5px;
  display           : flex;

  cursor            : pointer;
}

.slider-rail-progress-bar {
  position          : absolute;
  height            : 5px;
  width             : 0;
  background-color  : black;
}

.slider-thumb {

  position          : absolute;

  margin-top        : -15px;
  height            : 40px;
  width             : 10px;
  background-color  : blue;

  z-index           : 1;

  cursor            : pointer;
  outline           : none;
}

.slider-thumb .slider-thumb-tooltip {
  position          : absolute;
  bottom            : 50px;
  padding            : 0.5rem;
  left              : -10px;
  text-align        : center;
  border            : 1px solid #bbb;
  background-color  : white;
  min-width         : 35px;
}


/* From http://www.cssarrowplease.com/ */
.slider-thumb .slider-thumb-tooltip:after,
.slider-thumb .slider-thumb-tooltip:before {
  top: 100%;
  left: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.slider-thumb .slider-thumb-tooltip:after {
  border-color: rgba(255, 255, 255, 0);
  border-top-color: #fff;
  border-width: 7px;
  margin-left: -7px;
}
.slider-thumb .slider-thumb-tooltip:before {
  border-color: rgba(187, 187, 187, 0);
  border-top-color: #bbb;
  border-width: 8px;
  margin-left: -8px;
}

.slider-tick {
  position          : absolute;
  height            : 10px;
  width             : 1px;
  background-color  : #333;
  top               : -2px;
}

</style>
