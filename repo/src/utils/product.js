import { SCREEN_NAME_PLP } from '../constants';

export const handleNavigateToPlp = ({
  navigation = {},
  plpCategoryId = '',
  plpCategoryName = '',
  creativeName = '',
  widgetName = '',
}) => {
  navigation.navigate(SCREEN_NAME_PLP, {
    plpCategoryId,
    plpCategoryName,
    creativeName,
    widgetName,
  });
};
