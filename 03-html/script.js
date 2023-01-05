// Connecting to ROS
// -----------------
​
var ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090/'
});
​
ros.on('connection', function () {
    console.log('Connected to websocket server.');
});
​
ros.on('error', function (error) {
    console.log('Error connecting to websocket server: ', error);
});
​
ros.on('close', function () {
    console.log('Connection to websocket server closed.');
});
​
var topic = new ROSLIB.Topic({
    ros: ros,
    name: '/cmd_vel',
    messageType: 'geometry_msgs/Twist'
})
​
var msg = new ROSLIB.Message({
    linear: { x: 0.2, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: 0.6 },
})
​
topic.publish(msg)