import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  storeInformation: [
    {
      address: 'Cubes Park ICT, B-2, Plot P1, Sector M 25, Mussafah, Abu Dhabi',
      city: 'ict',
      code: 'ict',
      country_id: 'AE',
      description: null,
      email: null,
      entity_id: 57,
      facebook: null,
      image_path:
        'https://danubehome.com/media/mageworx/locations//p/l/placeholder_d_1000x1000_1.jpg',
      instagram: null,
      latitude: 24.3571535,
      longitude: 54.5239158,
      meta_description: null,
      meta_title: null,
      name: 'Danubehome - Abu Dhabi ICT ',
      phone_number: null,
      postcode: 51804,
      region: 'Abu Dhabi',
      skype: null,
      store_timings: null,
      whatsapp: null,
      working_hours: [
        {
          day: 'everyday',
          from: '10:00 am',
          to: '9:00 pm',
        },
      ],
    },
  ],
};

const ClickAndCollectSlice = createSlice({
  name: 'ClickAndCollect',
  initialState,
  reducers: {
    setStoreInformation(state, action) {
      state.storeInformation = action.payload;
    },
  },
});

export const { setStoreInformation } = ClickAndCollectSlice.actions;
const ClickAndCollectReducer = ClickAndCollectSlice.reducer;

export default ClickAndCollectReducer;
