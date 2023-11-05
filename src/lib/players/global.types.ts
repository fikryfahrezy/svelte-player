import type { YT, YTSDKReady } from './youtube.global.types';
import type { Twitch } from './twitch.global.types';
import type { SoundCloud } from './soundcloud.global.types';
import type { MixcloudPlayer } from './mixcloud.global.types';
import type { DailyMotion, DailyMotionSDKReady } from './dailymotion.global.types';
import type { Facebook, FacebookSDKReady } from './facebook.global.types';
import type { Vimeo } from './vimeo.global.types';
import type { PlayerJS } from './playerjs.global.types';
import type { Wistia } from './wistia.global.types';
import type { Vidyard, VidyardSDKReady } from './vidyard.global.types';
import type { HlsJS } from './hls.types';
import type { DashJS } from './dash.types';
import type { FlvJS } from './flv.types';

export type GlobalSDKYTKey = 'YT';
export type GlobalSDKYT = YT;
type GlobalSDKYTObject = {
	[k in GlobalSDKYTKey]: GlobalSDKYT;
};

export type GlobalSDKSoundCloudKey = 'SC';
export type GlobalSDKSoundCloud = SoundCloud;
type GlobalSDKSoundCloudObject = {
	[k in GlobalSDKSoundCloudKey]: GlobalSDKSoundCloud;
};

export type GlobalSDKVimeoKey = 'Vimeo';
export type GlobalSDKVimeo = Vimeo;
type GlobalSDKVimeoObject = {
	[k in GlobalSDKVimeoKey]: GlobalSDKVimeo;
};

export type GlobalSDKFacebookKey = 'FB';
export type GlobalSDKFacebook = Facebook;
type GlobalSDKFacebookObject = {
	[k in GlobalSDKFacebookKey]: GlobalSDKFacebook;
};

export type GlobalSDKPlayerJSKey = 'playerjs';
export type GlobalSDKPlayerJS = PlayerJS;
type GlobalSDKPlayerJSObject = {
	[k in GlobalSDKPlayerJSKey]: GlobalSDKPlayerJS;
};

export type GlobalSDKWistiaKey = 'Wistia';
export type GlobalSDKWistia = Wistia;
type GlobalSDKWistiaObject = {
	[k in GlobalSDKWistiaKey]: GlobalSDKWistia;
};

export type GlobalSDKTwitchKey = 'Twitch';
export type GlobalSDKTwitch = Twitch;
type GlobalSDKTwitchObject = {
	[k in GlobalSDKTwitchKey]: GlobalSDKTwitch;
};

export type GlobalSDKDailyMotionKey = 'DM';
export type GlobalSDKDailyMotion = DailyMotion;
type GlobalSDKDailyMotionObject = {
	[k in GlobalSDKDailyMotionKey]: GlobalSDKDailyMotion;
};

export type GlobalSDKMixcloudKey = 'Mixcloud';
export type GlobalSDKMixcloud = MixcloudPlayer;
type GlobalSDKMixcloudObject = {
	[k in GlobalSDKMixcloudKey]: GlobalSDKMixcloud;
};

export type GlobalSDKVidyardKey = 'VidyardV4';
export type GlobalSDKVidyard = Vidyard;
type GlobalSDKVidyardObject = {
	[k in GlobalSDKVidyardKey]: GlobalSDKVidyard;
};

export type GlobalSDKHLSKey = 'Hls';
export type GlobalSDKHLS = HlsJS;
type GlobalSDKHLSObject = {
	[k in GlobalSDKHLSKey]: GlobalSDKHLS;
};

export type GlobalSDKDASHKey = 'dashjs';
export type GlobalSDKDASH = DashJS;
type GlobalSDKDASHObject = {
	[k in GlobalSDKDASHKey]: GlobalSDKDASH;
};

export type GlobalSDKFLVKey = 'flvjs';
export type GlobalSDKFLV = FlvJS;
type GlobalSDKFLVObject = {
	[k in GlobalSDKFLVKey]: GlobalSDKFLV;
};

export type GlobalSDK = GlobalSDKYTObject &
	GlobalSDKSoundCloudObject &
	GlobalSDKVimeoObject &
	GlobalSDKFacebookObject &
	GlobalSDKPlayerJSObject &
	GlobalSDKWistiaObject &
	GlobalSDKTwitchObject &
	GlobalSDKDailyMotionObject &
	GlobalSDKMixcloudObject &
	GlobalSDKVidyardObject &
	GlobalSDKHLSObject &
	GlobalSDKDASHObject &
	GlobalSDKFLVObject;

export type GlobalSDKType = keyof GlobalSDK;
export type GlobalSDKValue = GlobalSDK[GlobalSDKType];

export type GlobalSDKYTReady = YTSDKReady;
export type GlobalSDKDailyMotionReady = DailyMotionSDKReady;
export type GlobalSDKFacebookReady = FacebookSDKReady;
export type GlobalSDKVidyardReady = VidyardSDKReady;
export type GlobalSDKReady =
	| GlobalSDKYTReady
	| GlobalSDKDailyMotionReady
	| GlobalSDKFacebookReady
	| GlobalSDKVidyardReady;
