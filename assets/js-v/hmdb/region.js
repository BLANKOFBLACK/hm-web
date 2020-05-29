$(document).ready(function() {
    $("#using_json").jstree({
            // "types": {
            //     "default": {
            //         "icon": "fa fa-user"
            //     }
            // },
            "core": {
                "data": function(obj, callback) {
                    var jsonstr = "[]";
                    var jsonarray = eval('(' + jsonstr + ')');
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: "POST",
                        url: httpurl+"/region/getAll",
                        dataType: "json",
                        // data:{
                        //     pid:0
                        // },
                        async: false,
                        success: function(data) {
                            if(data.code==1){
                                var arrays = data.result;
                                for (var i = 0; i < arrays.length; i++) {
                                    var arr = {
                                        "id": arrays[i].id,
                                        "parent": arrays[i].pid == "0" ? "#" : arrays[i].pid,
                                        "text": arrays[i].regionName,
                                        "state": { "opened": false}
                                    }
                                    jsonarray.push(arr);
                                }
                            }
                        }
                    });
                    callback.call(this, jsonarray);
                },
                "check_callback": true
        },
        "state" : { "key" : "Region" },
        "plugins": ["contextmenu", "sort", "types", "state","unique","dnd"],
        "contextmenu": {
            "items": {
                "create": {
                    "label": "创建",
                    "action": function (data) {
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                        inst.create_node(obj,"请输入名称", "last", function(new_node) {
                            setTimeout(function() {
                                inst.edit(new_node)
                            }, 0)
                        })}
                },
                "rename":{
                    "label": "重命名",
                    "action": function (data) {
                        var inst = $.jstree.reference(data.reference),
                            obj = inst.get_node(data.reference);
                        inst.edit(obj)
                    }
                },
                "delete": {
                    "label": "删除",
                    "action": function (data) {

                        swal({
                            title: '',
                            text: '您确定要删除吗',
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((willDelete) => {
                            if (willDelete) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                $.ajax({
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    type: "POST",
                                    url: httpurl+"/region/deleteRegion",
                                    dataType: "json",
                                    data:{
                                        id:obj.id
                                    },
                                    success: function(data) {
                                        if(data.code==1){
                                            if (inst.is_selected(obj)) {
                                                inst.delete_node(inst.get_selected())
                                            } else { inst.delete_node(obj) }
                                            swal("删除成功！", "您已经永久删除了这条信息。", "success");
                                        }else{
                                            toastr.warning(data.message)
                                        }
                                    }
                                })
                            }
                        });
                    }
                }
            }
        }
    }).bind(
        "create_node.jstree",
        function(e, data) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+"/region/createRegion",
                dataType: "json",
                data:{
                    name:data.node.text,
                    pid:data.node.parent,
                },
                success: function(res) {
                    if(res.code==1){
                        data.instance.set_id(data.node, res.result);
                    }else{
                        data.instance.refresh();
                        toastr.warning(res.message)
                    }
                }
            })
    }).bind(
    "rename_node.jstree",
    function(e, data) {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            url: httpurl+"/region/renameRegion",
            dataType: "json",
            data:{
                name:data.node.text,
                id:data.node.id
            },
            success: function(res) {
                if(res.code!=1){
                    data.instance.refresh();
                    toastr.warning(res.message)
                }
            }
        })
    }).bind(
        "move_node.jstree",
        function (e,data) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+"/region/moveRegion",
                dataType: "json",
                data:{
                    pid:data.parent,
                    id:data.node.id
                },
                success: function(res) {
                    if(res.code!=1){
                        data.instance.refresh();
                        toastr.warning(res.message)
                    }
                }
            })
        }
    )
});