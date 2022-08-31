import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';
import DownArrow from '../../../../assets/svg/DownArrow.svg';
import Block from '../../../components/Block';
import { Divider } from '../../../components/Divider';
import { FONT_FAMILY_ENGLISH_REGULAR } from '../../../constants';
import colors from '../../../styles/colors';
const { width } = Dimensions.get('window');

export const ProductAttributes = ({ productData }) => {
  return (
    <Block
      flex={false}
      width={'100%'}
      selfcenter
      padding={[20, 15, 20, 15]}
      color={colors.white}
      margin={[6.5, 0, 6.5, 0]}
    >
      {productData?.map((data, index) => {
        const [isExpanded, setIsExpanded] = useState(
          data.expand_by_default || false
        );

        if (data?.fields?.length <= 0) {
          return null;
        }

        return (
          <Block flex={false}>
            <Collapse
              isExpanded={isExpanded}
              onToggle={(res) => setIsExpanded(res)}
            >
              <CollapseHeader>
                <Block style={styles.collapseHeaderContainer}>
                  <Block style={styles.ImageScrollerMainViewStyle}>
                    <Text style={styles.ImageScrollerTitleTextStyle}>
                      {data?.name}
                    </Text>
                  </Block>
                  <Block
                    flex={false}
                    style={[
                      styles.collapseHeaderArrow,
                      isExpanded ? {} : styles.collapseHeaderArrowRotate,
                    ]}
                  >
                    <DownArrow height={13} width={13} />
                  </Block>
                </Block>
              </CollapseHeader>
              <CollapseBody>
                <Block flex={false} margin={[10, 0, 0, 0]}>
                  {data?.fields?.map((res, index) => {
                    return res?.display_as_paragraph === true ? (
                      <Block flex={false} key={res?.name + index}>
                        {index !== 0 ? (
                          <Block margin={[5, 0, 0, 0]}>
                            <Text
                              style={[
                                styles.ImageScrollerTitleTextStyle,
                                { fontSize: 16 },
                              ]}
                            >
                              {res?.name}
                            </Text>
                          </Block>
                        ) : null}
                        <Block margin={[5, 0, 5, 0]}>
                          <HTML
                            source={{ html: res?.value }}
                            contentWidth={width - 20}
                          />
                        </Block>
                      </Block>
                    ) : res?.display_as_link === true ? (
                      <Block flex={false} key={res?.name + index}>
                        {index !== 0 ? (
                          <Block>
                            <Text
                              style={[
                                styles.ImageScrollerTitleTextStyle,
                                { fontSize: 16 },
                              ]}
                            >
                              {res?.name}
                            </Text>
                          </Block>
                        ) : null}
                        <Block margin={[5, 0, 5, 0]}>
                          <Text
                            style={[styles.attributeNameText, { color: 'red' }]}
                          >
                            {res?.value}
                          </Text>
                        </Block>
                      </Block>
                    ) : res?.display_as_image === true ? (
                      <Block flex={false} key={res?.name + index}>
                        {index !== 0 ? (
                          <Block>
                            <Text
                              style={[
                                styles.ImageScrollerTitleTextStyle,
                                { fontSize: 16 },
                              ]}
                            >
                              {res?.name}
                            </Text>
                          </Block>
                        ) : null}
                        <Block
                          margin={[5, 0, 5, 0]}
                          height={200}
                          width={'100%'}
                        >
                          <Image
                            style={styles.img}
                            source={{ uri: res?.value?.split(',')?.[0] }}
                          />
                        </Block>
                      </Block>
                    ) : (
                      <Block flex={false} key={res?.name + index}>
                        <Block flex={false} style={styles.flatListStyle}>
                          <Block color={'#F3F3F3'} padding={[8]}>
                            <Text style={styles.attributeNameText}>
                              {res?.name}
                            </Text>
                          </Block>
                          <Block color={'white'} padding={[8]}>
                            <HTML source={{ html: res?.value }} />
                          </Block>
                        </Block>
                      </Block>
                    );
                  })}
                </Block>
              </CollapseBody>
            </Collapse>
            {index === productData?.length - 1 ? null : (
              <Divider ExtraStyle={{ marginVertical: 20 }} />
            )}
          </Block>
        );
      })}
    </Block>
  );
};

const styles = StyleSheet.create({
  collapseHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  collapseHeaderArrow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    borderStyle: 'solid',
    borderColor: '#E1E1E1',
  },
  flatListStyle: {
    flexDirection: 'row',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderColor: '#E1E1E1',
  },
  collapseHeaderArrowRotate: {
    transform: [{ rotate: '270deg' }],
  },
  collapseBodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    marginTop: 5,
    paddingLeft: 10,
  },
  ImageScrollerMainViewStyle: { justifyContent: 'center' },
  ImageScrollerTitleTextStyle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    textAlign: 'left',
    color: '#0A0A0A',
  },
  attributeNameText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#333333',
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
