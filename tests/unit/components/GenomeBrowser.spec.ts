import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import GenomeBrowser from '@/components/GenomeBrowser.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('GenomeBrowser', () => {
  let wrapper: any;

  beforeEach(() => {
    const store = new Vuex.Store({});
    wrapper = shallowMount(GenomeBrowser, { store, localVue });
  });

  it('should render the component', () => {
    expect(wrapper).toBeDefined();
  });
});
