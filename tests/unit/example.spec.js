import { shallowMount } from '@vue/test-utils'
import AriaSlider from '@/lib-components/input/AriaSlider.vue'

describe('AriaSlider.vue', () => {

  it('initializes cleanly when no props are passed in', () => {
    expect(() => {
        shallowMount(AriaSlider, {
          propsData: {},
        })
      }
    ).not.toThrow()
  })



  // it('TODO: implement me', () => {
  //   const msg = 'new message'
  //   const wrapper = shallowMount(AriaSlider, {
  //     propsData: { msg }
  //   })
  //   expect(wrapper.text()).toMatch(msg)
  // })


})
