var jmespath = require("jmespath");
var AWS = require("aws-sdk");
var promisefy = require("callback2promise");

var ec2 = new AWS.EC2({
    region: "ap-northeast-1"
});

var describeImages = promisefy.call(ec2, ec2.describeImages);
var describeImagePromise = describeImages.call(ec2, {
    Filters: [
        {
            Name: "description",
            Values: ["Amazon Linux AMI 2015.03.? x86_64 HVM GP2"]
        }
    ]
});

var describeVpcs = promisefy.call(ec2, ec2.describeVpcs);
var describeSubnets = promisefy.call(ec2, ec2.describeSubnets);
var runInstances = promisefy.call(ec2, ec2.runInstances);
var terminateInstances = promisefy.call(ec2, ec2.terminateInstances);

var amiId, vpcId, subnetId, instanceId;

describeImagePromise
    .then(function (data) {
        amiId = jmespath.search(data, "Images[0].ImageId");
        var description = jmespath.search(data, "Images[0].Description");
        console.log(amiId + " " + description);

        return describeVpcs.call(ec2, {
            Filters: [
                {
                    Name: "isDefault",
                    Values: ["true"]
                }
            ]
        });

    })
    .then(function (data) {
        vpcId = data.Vpcs[0].VpcId;
        console.log("vpcId is " + vpcId);

        return describeSubnets.call(ec2, {
            Filters: [
                {
                    Name: "vpc-id",
                    Values: [vpcId]
                }
            ]
        });
    })
    .then(function (data) {
        subnetId = jmespath.search(data, "Subnets[0].SubnetId");
        console.log("SubnetId is " + subnetId);

        return runInstances.call(ec2, {
            ImageId: amiId,
            MinCount: 1,
            MaxCount: 1,
            KeyName: "tokyo", // replace here with yours
            InstanceType: "t2.micro",
            SubnetId: subnetId
        });
    })
    .then(function (data) {
        instanceId = jmespath.search(data, "Instances[0].InstanceId");
        console.log("Instance started! " + instanceId);
        return terminateInstances.call(ec2, {InstanceIds: [instanceId]});
    })
    .then(function (data) {
        console.log("Instance is terminated");
        console.log(data);
    })
    .catch(function (err) {
        console.log(err);
    });