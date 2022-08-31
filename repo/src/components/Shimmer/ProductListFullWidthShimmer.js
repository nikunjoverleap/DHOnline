import React from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default ProductListFullWidthShimmer = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: Dimensions.get('window').width,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map(() => {
        return (
          <SkeletonPlaceholder>
            <View
              style={{
                width: (Dimensions.get('window').width - 36) / 2,
                height: 296,
                marginRight: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#E1E9EE',
                borderStyle: 'solid',
              }}
            >
              <View
                style={{
                  width: (Dimensions.get('window').width - 36) / 2,
                  height: 200,
                  borderRadius: 4,
                }}
              ></View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: (Dimensions.get('window').width - 66) / 2,
                    height: 8,
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                ></View>
                <View
                  style={{
                    width: (Dimensions.get('window').width - 66) / 2,
                    height: 8,
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                ></View>
                <View
                  style={{
                    width: (Dimensions.get('window').width - 66) / 2,
                    height: 40,
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                ></View>
              </View>
            </View>
          </SkeletonPlaceholder>
        );
      })}
    </View>
  );
};
