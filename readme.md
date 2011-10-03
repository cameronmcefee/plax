Plax is a [jQuery](http://jquery.com) / [Ender](http://ender.no.de) plugin that makes it suuuuuper easy to parallax elements in your site based on mouse position. You can see it implemented in many places throughout GitHub, including the [404 page](http://www.github.com/404), the [500 page](http://www.github.com/500), and the [about page](http://www.github.com/about). I've also used a modified version to [parallax a URL](http://cameronmcefee.com/parallax-url/).


## Dependencies

### [jQuery](http://jquery.com/) or [Ender](http://ender.no.de/) ###


## Usage

### [Plax Demo](http://www.cameronmcefee.com/plax-demo)

In the &lt;head&gt; of your document, link both jQuery and plax.

```html
<script type="text/javascript" src="/js/jquery.min.js"></script>
<!-- <script type="text/javascript" src="/js/ender.min.js"></script> -->
<script type="text/javascript" src="/js/plax.js"></script>
```

Then in your javascript, add each "layer" to the list of layers to be parallaxed. Once that's done, enable Plax and you're good to go.

```javascript
$('#plax-octocat').plaxify({"xRange":40,"yRange":40})
$('#plax-earth').plaxify({"xRange":20,"yRange":20,"invert":true})
$('#plax-bg').plaxify({"xRange":10,"yRange":10,"invert":true})
$.plax.enable()
```

Another way is to specify the arguments as data attributes on the layer elements.

```html
<img src="octocat.png" data-xrange="40" data-yrange="40">
<img src="earth.png" data-xrange="20" data-yrange="20">
<img src="bg.png" data-xrange="10" data-yrange="10" data-invert="true">
```

Then plaxify them in bulk.

```javascript
$('img').plaxify()
$.plax.enable()
```

You can dynamically redefine the range of a layer by running `plaxify()` on it again. If the id matches another id in the layer array, it will replace it with the new range.

```javascript
$('#plax-octocat').plaxify({"xRange":40,"yRange":40})
$('#plax-earth').plaxify({"xRange":20,"yRange":20,"invert":true})
$('#plax-bg').plaxify({"xRange":10,"yRange":10,"invert":true})
$.plax.enable()

$('#my-btn').click(function(){
  // bigger range
  $('#plax-octocat').plaxify({"xRange":200,"yRange":200})
})
```


## Documentation

### plaxify()

Add an item to the list of parallaxing layers. Ranges are centered at the items start location. For example, an item with a 20px range will be able to move 10px forward and 10px backward from its start location.

__Parameters__

`xRange` &mdash; integer: is the distance across the x-axis the object will travel.

`yRange` &mdash; integer: is the distance across the y-axis the object will travel.

`invert` &mdash; boolean: inverting will invert the direction the object will travel across each axis.*

\* The same effect can be achieved by providing `xRange` and `yRange` with negative numbers, making it possible to invert only a single axis.

### enable()

Enable parallaxing.

### disable()

Disable parallaxing.


## Best Practices

- Items should be absolutely positioned, with top: and left: values specified.

- If you plan to parallax a background plane, be sure to give it enough extra "bleed" room so the image stays behind it's frame at all times. Usually your bleed on one side should be equal to half the range you give it, though you can give it more if you are paranoid.

- For more realistic parallaxing (see "how to do the math" below), pick a "anchor object". Base your ranges for each object on the anchor object's range, getting exponentially larger the farther it is supposed to be from the anchor object. For example, an object close to your anchor object might have 2x its range, while an object really far away may have 5x as big a range.

- Objects that appear behind the anchor object should have `invert` set to true.


## How To Fake It

Here are a couple real-life examples of parallaxing and a quick description of how you might emulate it with Plax.

### Example #1

Picture driving down the highway. There are three objects: You, in the inside lane, a truck in the outside lane, and a sign on the side of the road. As you drive past the truck, the sign always manages to stay just out of view behind the it.

__The lesson__

In this case, the truck becomes the "anchor", as it stays relatively still. It is the item upon which all the movement is based. If you were to recreate this scenario in your javascript, the truck would have a small range, say 10&ndash;20 pixels. That way, it would move a little, but not too much. Since the car you are in is moving faster relative to the truck so it would need a larger range like 50&ndash;100 pixels. Finally, the sign, since it is "behind" the truck, will need to have `invert` set to true. Any object behind the "anchor" object should be inverted. Assuming the sign is always about the same distance from the truck as you are (the scenario where you never actually see the sign) then its range should also be around 50&ndash;100 pixels.


### Example #2

Picture another scenario driving scenario. You're the passenger in a car driving past a barn. In the distance you can see mountains. If you look at the grass on the side of the road, it seems to be flying by at blazing speed. If you look at the barn, it still appears to be passing by, but much more slowly than the grass. If you look to the mountains in the distance, they pretty much seem to be staying where they are at.

__The lesson__

The principals from the previous scenario are still present in this situation, only the anchor has moved to the back layer. Since the mountains are far of in the distance and barely moving, they get a range of 5&ndash;10 pixels. Each layer as it comes forward should have a greater range than the layer before it. The barn would probably have 20&ndash;30 pixels of range and the grass near the road would probably have 100 pixels of range.


## Future plans for Plax

- __Automatic plaxing:__ Specify an array of elements and let Plax figure out how to move then around.

- __Smarter Plaxing:__ Right now Plax assumes your items are absolutely positioned. In the future I'd like to have Plax convert the current positioning scheme to what it needs, allowing initially relatively positioned elements.

- __plaxTo()__ It'd be cool if you could give Plax a percentage to parallax to. This would allow for more than just the mouse as the source of input.