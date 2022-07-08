'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
	Text,
	View,
	TouchableOpacity,
	Image,
	Pressable,
	ViewPropTypes
} from 'react-native';

import styles from './VirtualKeyboard.style';

const BACK = 'back';
const CLEAR = 'clear';
const PRESS_MODE_STRING = 'string';

export default class VirtualKeyboard extends Component {

	static propTypes = {
		pressMode: PropTypes.oneOf(['string', 'char']),
		color: PropTypes.string,
		maxLength: PropTypes.number,
		onPress: PropTypes.func.isRequired,
		backspaceImg: PropTypes.number,
		applyBackspaceTint: PropTypes.bool,
		decimal: PropTypes.bool,
		style: ViewPropTypes.style,
		rowStyle: ViewPropTypes.style,
		cellStyle: ViewPropTypes.style,
		pressableStyle: ViewPropTypes.style,
		pressedStyle: ViewPropTypes.style,
		clearOnLongPress: PropTypes.bool,
		preventMultipleDecimal: PropTypes.bool,
		isCalculator: PropTypes.bool
	}

	static defaultProps = {
		pressMode: 'string',
		color: 'gray',
		backspaceImg: require('./backspace.png'),
		applyBackspaceTint: true,
		decimal: false,
		clearOnLongPress: false
	}

	constructor(props) {
		super(props);
		this.state = {
			text: '',
		};
	}

	render() {
		return (
			<View style={[styles.container, this.props.style]}>
				{this.Row([1, 2, 3])}
				{this.Row([4, 5, 6])}
				{this.Row([7, 8, 9])}
				<View style={[styles.row, this.props.rowStyle]}>
					{this.props.decimal ? this.Cell('.') : <View style={{ flex: 1 }} /> }
					{this.Cell(0)}
					{this.Backspace()}
				</View>
			</View>
		);
	}

	Backspace() {
		return (
			<View style={styles.backspace} accessibilityLabel='backspace'>
				<Pressable style={({ pressed }) => [this.props.pressableStyle, pressed && this.props.pressedStyle]} onPress={() => { this.onPress(BACK) }}
					onLongPress={() => { if(this.props.clearOnLongPress) this.onPress(CLEAR) }}
				>
					<Image source={this.props.backspaceImg} resizeMode='contain' style={this.props.applyBackspaceTint && ({ tintColor: this.props.color })} />
				</Pressable>
			</View>
		);
	}

	Row(numbersArray) {
		let cells = numbersArray.map((val) => this.Cell(val));
		return (
			<View style={[styles.row, this.props.rowStyle]}>
				{cells}
			</View>
		);
	}

	Cell(symbol) {
		return (
			<View style={[styles.cell,  this.props.cellStyle]} key={symbol} accessibilityLabel={symbol.toString()}>
				<Pressable style={({ pressed }) => [this.props.pressableStyle, pressed && this.props.pressedStyle]} onPress={() => { this.onPress(symbol.toString()) }}>
					<Text style={[styles.number, { color: this.props.color }]}>{symbol}</Text>
				</Pressable>
			</View>
		);
	}

	onPress(val) {
		if (this.props.pressMode === PRESS_MODE_STRING) {
			let curText = this.state.text;
			if(curText.length === 0 && val === '.') curText += '0.';
			if(this.props.isCalculator && curText === '0' && val === '0') return;
			if(curText.length > 0 && val === '.' && curText.indexOf('.') > -1) return;
			if (isNaN(val)) {
				if (val === BACK) {
					curText = curText.slice(0, -1);
				} else if (val === CLEAR) {
					curText = "";
				} else {
					if(this.props.maxLength && curText.length >= this.props.maxLength) return;
					curText += val;
				}
			} else {
				if(this.props.maxLength && curText.length >= this.props.maxLength) return;
				if(this.props.preventMultipleDecimal && curText.includes('.') && val === '.') return;
				curText += val;
			}
			if(this.props.isCalculator && curText !== '0' && !curText.startsWith('0.')) curText = curText.replace(/^0+/, '');
			this.setState({ text: curText });
			this.props.onPress(curText);
		} else /* if (props.pressMode == 'char')*/ {
			this.props.onPress(val);
		}
	}

}
