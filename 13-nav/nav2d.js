var NAV2D = NAV2D || { REVISION: '0.3.0' }
;(NAV2D.ImageMapClientNav = function (a) {
  var b = this
  ;(a = a || {}), (this.ros = a.ros)
  var c = a.topic || '/map_metadata',
    d = a.image
  ;(this.serverName = a.serverName || '/move_base'),
    (this.actionName = a.actionName || 'move_base_msgs/MoveBaseAction'),
    (this.rootObject = a.rootObject || new createjs.Container()),
    (this.viewer = a.viewer),
    (this.withOrientation = a.withOrientation || !1),
    (this.navigator = null)
  var e = new ROS2D.ImageMapClient({
    ros: this.ros,
    rootObject: this.rootObject,
    topic: c,
    image: d,
  })
  e.on('change', function () {
    ;(b.navigator = new NAV2D.Navigator({
      ros: b.ros,
      serverName: b.serverName,
      actionName: b.actionName,
      rootObject: b.rootObject,
      withOrientation: b.withOrientation,
    })),
      b.viewer.scaleToDimensions(e.currentImage.width, e.currentImage.height),
      b.viewer.shift(
        e.currentImage.pose.position.x,
        e.currentImage.pose.position.y,
      )
  })
}),
  (NAV2D.Navigator = function (a) {
    function b(a) {
      var b = new ROSLIB.Goal({
        actionClient: i,
        goalMessage: { target_pose: { header: { frame_id: 'map' }, pose: a } },
      })
      b.send()
      var d = new ROS2D.NavigationArrow({
        size: 15,
        strokeSize: 1,
        fillColor: createjs.Graphics.getRGB(255, 64, 128, 0.66),
        pulse: !0,
      })
      ;(d.x = a.position.x),
        (d.y = -a.position.y),
        (d.rotation = h.rosQuaternionToGlobalTheta(a.orientation)),
        (d.scaleX = 1 / h.scaleX),
        (d.scaleY = 1 / h.scaleY),
        c.rootObject.addChild(d),
        b.on('result', function () {
          c.rootObject.removeChild(d)
        })
    }
    var c = this
    a = a || {}
    var d = a.ros,
      e = a.serverName || '/move_base',
      f = a.actionName || 'move_base_msgs/MoveBaseAction',
      g = a.withOrientation || !1
    this.rootObject = a.rootObject || new createjs.Container()
    var h,
      i = new ROSLIB.ActionClient({ ros: d, actionName: f, serverName: e })
    h =
      c.rootObject instanceof createjs.Stage
        ? c.rootObject
        : c.rootObject.getStage()
    var j = new ROS2D.NavigationArrow({
      size: 25,
      strokeSize: 1,
      fillColor: createjs.Graphics.getRGB(255, 128, 0, 0.66),
      pulse: !0,
    })
    ;(j.visible = !1), this.rootObject.addChild(j)
    var k = !1,
      l = new ROSLIB.Topic({
        ros: d,
        name: '/robot_pose',
        messageType: 'geometry_msgs/Pose',
        throttle_rate: 100,
      })
    if (
      (l.subscribe(function (a) {
        ;(j.x = a.position.x),
          (j.y = -a.position.y),
          k || ((j.scaleX = 1 / h.scaleX), (j.scaleY = 1 / h.scaleY), (k = !0)),
          (j.rotation = h.rosQuaternionToGlobalTheta(a.orientation)),
          (j.visible = !0)
      }),
      g === !1)
    )
      this.rootObject.addEventListener('dblclick', function (a) {
        var c = h.globalToRos(a.stageX, a.stageY),
          d = new ROSLIB.Pose({ position: new ROSLIB.Vector3(c) })
        b(d)
      })
    else {
      var m = null,
        n = null,
        o = 0,
        p = 0,
        q = null,
        r = !1,
        s = 0,
        t = 0,
        u = function (a, d) {
          if ('down' === d)
            (m = h.globalToRos(a.stageX, a.stageY)),
              (n = new ROSLIB.Vector3(m)),
              (r = !0)
          else if ('move' === d) {
            if ((c.rootObject.removeChild(q), r === !0)) {
              var e = h.globalToRos(a.stageX, a.stageY),
                f = new ROSLIB.Vector3(e)
              ;(q = new ROS2D.NavigationArrow({
                size: 25,
                strokeSize: 1,
                fillColor: createjs.Graphics.getRGB(0, 255, 0, 0.66),
                pulse: !1,
              })),
                (s = f.x - n.x),
                (t = f.y - n.y),
                (o = Math.atan2(s, t)),
                (p = o * (180 / Math.PI)),
                p >= 0 && 180 >= p ? (p += 270) : (p -= 90),
                (q.x = n.x),
                (q.y = -n.y),
                (q.rotation = p),
                (q.scaleX = 1 / h.scaleX),
                (q.scaleY = 1 / h.scaleY),
                c.rootObject.addChild(q)
            }
          } else if (r) {
            r = !1
            var g = h.globalToRos(a.stageX, a.stageY),
              i = new ROSLIB.Vector3(g)
            ;(s = i.x - n.x),
              (t = i.y - n.y),
              (o = Math.atan2(s, t)),
              o >= 0 && o <= Math.PI
                ? (o += (3 * Math.PI) / 2)
                : (o -= Math.PI / 2)
            var j = Math.sin(-o / 2),
              k = Math.cos(-o / 2),
              l = new ROSLIB.Quaternion({ x: 0, y: 0, z: j, w: k }),
              u = new ROSLIB.Pose({ position: n, orientation: l })
            b(u)
          }
        }
      this.rootObject.addEventListener('stagemousedown', function (a) {
        u(a, 'down')
      }),
        this.rootObject.addEventListener('stagemousemove', function (a) {
          u(a, 'move')
        }),
        this.rootObject.addEventListener('stagemouseup', function (a) {
          u(a, 'up')
        })
    }
  }),
  (NAV2D.OccupancyGridClientNav = function (a) {
    var b = this
    ;(a = a || {}), (this.ros = a.ros)
    var c = a.topic || '/map',
      d = a.continuous
    ;(this.serverName = a.serverName || '/move_base'),
      (this.actionName = a.actionName || 'move_base_msgs/MoveBaseAction'),
      (this.rootObject = a.rootObject || new createjs.Container()),
      (this.viewer = a.viewer),
      (this.withOrientation = a.withOrientation || !1),
      (this.navigator = null)
    var e = new ROS2D.OccupancyGridClient({
      ros: this.ros,
      rootObject: this.rootObject,
      continuous: d,
      topic: c,
    })
    e.on('change', function () {
      ;(b.navigator = new NAV2D.Navigator({
        ros: b.ros,
        serverName: b.serverName,
        actionName: b.actionName,
        rootObject: b.rootObject,
        withOrientation: b.withOrientation,
      })),
        b.viewer.scaleToDimensions(e.currentGrid.width, e.currentGrid.height),
        b.viewer.shift(
          e.currentGrid.pose.position.x,
          e.currentGrid.pose.position.y,
        )
    })
  })
