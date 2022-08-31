import React from 'react';
import { Dimensions, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default HomeScreenShimmer = () => {
  return (
    <View
      style={{
        width: Dimensions.get('window').width,
      }}
    >
      <SkeletonPlaceholder>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 200,
            marginBottom: 10,
          }}
        ></View>
      </SkeletonPlaceholder>

      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {[1, 2, 3, 4].map((key) => {
          return (
            <SkeletonPlaceholder key={key.toString()}>
              <View
                style={{
                  width: Dimensions.get('window').width / 2.5,
                  height: 60,
                  marginBottom: 10,
                  marginLeft: 10,
                  borderRadius: 4,
                }}
              ></View>
            </SkeletonPlaceholder>
          );
        })}
      </View>
      <SkeletonPlaceholder>
        <View
          style={{
            width: Dimensions.get('window').width - 20,
            height: 100,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 4,
          }}
        ></View>
      </SkeletonPlaceholder>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {[1, 2, 3].map((key) => {
          return (
            <SkeletonPlaceholder key={key.toString()}>
              <View
                style={{
                  width: Dimensions.get('window').width / 2.5,
                  height: 296,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: '#E1E9EE',
                  borderStyle: 'solid',
                  marginLeft: 12,
                }}
              >
                <View
                  style={{
                    width: Dimensions.get('window').width / 2.5,
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
                      width: (Dimensions.get('window').width - 66) / 2.5,
                      height: 8,
                      marginTop: 10,
                      borderRadius: 4,
                    }}
                  ></View>
                  <View
                    style={{
                      width: (Dimensions.get('window').width - 66) / 2.5,
                      height: 8,
                      marginTop: 10,
                      borderRadius: 4,
                    }}
                  ></View>
                  <View
                    style={{
                      width: (Dimensions.get('window').width - 66) / 2.5,
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
      <SkeletonPlaceholder>
        <View
          style={{
            width: Dimensions.get('window').width - 20,
            height: 100,
            marginBottom: 10,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 4,
          }}
        ></View>
      </SkeletonPlaceholder>
    </View>
  );
};
