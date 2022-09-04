
window.onload = () => {
	let button = document.getElementById("funny-button-lol-lmao");

	let bp = getButtonPosition(button);
	button.style.position = "absolute";

	document.addEventListener("mousemove", mouseAvoid(button));
}

/**
 * Return a function which will move the button based on the data from a MouseEvent
 * @param {HTMLButtonElement} button
 */
function mouseAvoid(button) {

	/** @param {MouseEvent} ev */
	return (ev) => {
		let mx = ev.clientX + ev.movementX;
		let my = ev.clientY + ev.movementY;
		let bs = getButtonSize(button);
		let bw = bs.x;
		let bh = bs.y;
		let bp = getButtonPosition(button);
		let bx = bp.x;
		let by = bp.y;
		
		let delta = determineSide(mx, my, bx, by, bw, bh);

		setButtonPosition(button, v(delta.x+bx, delta.y+by));
	}
}

class Quad {
	/**
	 * Points must be given in clockwise order unless the positive Y direction points up
	 * @param {Vec} p1 @param {Vec} p2 @param {Vec} p3 @param {Vec} p4
	 */
	constructor(p1, p2, p3, p4) {
		/** @type {[Vec, Vec, Vec, Vec]} */
		this.points = [p1, p2, p3, p4]
	}

	/** @param {Vec} p */
	contains(p) {
		// if every edge going counterclockwise finds `p` to the left of itself, `p` is inside
		return this.points.every((v1, i) => {
			let v2 = this.points[(i+1) % 4];

			let edge = v1.to(v2);	// v1 -> v2
			let vp = v1.to(p);		// v1 -> p

			let cross = edge.cross(vp);	// if positive, then p is to the left of edge
			return cross >= 0;
		});
	}
}

class Vec {
	/** @param {Number} x @param {Number} y */
	constructor(x, y) {
		/** @type {Number} */
		this.x = x;
		/** @type {Number} */
		this.y = y;
	}

	/** @param {Vec} other */
	cross(other) {
		return this.x * other.y - this.y * other.x; // not really cross more like ||cross||
	}

	/** @param {Vec} other */
	dot(other) {
		return this.x * other.x + this.y * other.y;
	}

	/** @param {Vec} other */
	to(other) {
		return new Vec(other.x - this.x, other.y - this.y);
	}
	
	/** @param {Vec} other */
	add(other) {
		return new Vec(other.x + this.x, other.y + this.y);
	}
}

/** @param {Number} x @param {Number} y */
function v(x, y) {
	return new Vec(x, y);
}

/** @return {Vec} */
function determineSide(mx, my, bx, by, bw, bh) {
	let bh2 = bh/2
	let v1 = v(bx, by);
	let v2 = v(bx, by+bh);
	let v3 = v(bx+bw, by+bh);
	let v4 = v(bx+bw, by);
	let m1 = v(bx+bh2, by+bh2);
	let m2 = v(bx+bw-bh2, by+bh2);

	let p = v(mx, my);
	
	// right trapezoid (triangle)
	let right = new Quad(v4, v3, m2, m2);
	if (right.contains(p)) { 
		// console.log("right");
		return v(mx - (bx+bw) - 1, 0);
	}

	// top trapezoid
	let top = new Quad(v1, v4, m2, m1);
	if (top.contains(p)) {
		// console.log("top");
		return v(0, my - by + 1);
	}
	
	// left trapezoid (triangle)
	let left = new Quad(v1, m1, m1, v2);
	if (left.contains(p)) {
		// console.log("left");
		return v(mx - bx + 1, 0);
	}

	// bottom trapezoid
	let bottom = new Quad(m1, m2, v3, v2);
	if (bottom.contains(p)) {
		// console.log("bottom");
		return v(0, my - (by+bh) - 1);
	}

	return v(0, 0);
}

/**
 * @param {HTMLButtonElement} button
 * @return {Vec}
 */
function getButtonPosition(button) {
	let style = window.getComputedStyle(button);
	return v(Number(style.left.replace("px", "")),
		     Number(style.top.replace("px", "")));
}

/**
 * @param {HTMLButtonElement} button
 * @return {Vec}
 */
 function getButtonSize(button) {
	let style = window.getComputedStyle(button);
	return v(Number(style.width.replace("px", "")),
		     Number(style.height.replace("px", "")));
}

/**
 * @param {HTMLButtonElement} button
 * @param {Vec} pos
 */
function setButtonPosition(button, pos) {
	button.style.left = pos.x.toString() + "px";
	button.style.top = pos.y.toString() + "px";
}
