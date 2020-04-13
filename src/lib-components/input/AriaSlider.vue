<template>

  <div
    class="aria-slider">

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
        :aria-valuemin="valueMin"
        :aria-valuenow="valueNow"
        :aria-valuemax="valueMax">

        <div
          class="slider-thumb-tooltip">
          {{valueNow}}
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

  export default {
    props: ["min", "max", "value", "showProgressBar", "showTicks"],

    data() {
      return {
        valueMin        : "",
        valueMax        : "",
        valueNow        : "",
        ticks           : [],
        tickIncrement   : 0
      };
    },

    created() {
      this.valueMin = this.min;
      this.valueMax = this.max;
      this.valueNow = this.value;
    },

    mounted() {

      // Tick increment is the width of the rail divided by the number of spaces
      // between ticks
      this.tickIncrement = this.getRailWidth() / (this.valueMax - this.valueMin);

      // Draw ticks
      let startingTick = null;
      for(let i = 0; i <= this.valueMax - this.valueMin; ++i) {
        const value = Number(this.valueMin) + i;
        const tick = {
          xPosition   : this.tickIncrement * i,
          value       : value
        };
        this.ticks.push(tick);

        if (tick.value === Number(this.valueNow)) {
          startingTick = tick;
        }

      }

      if (!startingTick) {
        startingTick = this.ticks[0];
      }

      this.moveThumbTo(startingTick);
      this.setValueNow(startingTick.value);
    },

    methods: {

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

      handleRailClick(event) {
        const xOffset = this.getMouseEventXOffset(event);
        const nearestTick = this.getTickFromXOffset(xOffset);

        if (nearestTick) {
          this.moveThumbTo(nearestTick);
          this.setValueNow(nearestTick.value);
          this.dispatchChange();
        }
      },

      handleMouseDown() {

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

      },

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
}

.slider-thumb .slider-thumb-tooltip {
  position          : absolute;
  bottom            : 40px;
  padding            : 0.5rem;
  /*left              : 0;*/
  left              : -10px;
  /*right             : 10px;*/
  text-align        : center;
  border            : 1px solid black;
  background-color  : white;
  min-width         : 25px;
}

.slider-tick {
  position          : absolute;
  height            : 10px;
  width             : 1px;
  background-color  : #333;
  top               : -2px;
}

</style>
