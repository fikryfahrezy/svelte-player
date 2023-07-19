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
import type { HlsJS, DashJS, FlvJS, Hls } from './fileplayer.global.types';

export type GlobalSDK = {
	YT: YT;
	SC: SoundCloud;
	Vimeo: Vimeo;
	FB: Facebook;
	playerjs: PlayerJS;
	Wistia: Wistia;
	Twitch: Twitch;
	DM: DailyMotion;
	Mixcloud: MixcloudPlayer;
	VidyardV4: Vidyard;
	Hls: HlsJS;
	dashjs: DashJS;
	flvjs: FlvJS;
};

export type GlobalSDKType = keyof GlobalSDK;

export type GlobalSDKYTKey = Extract<GlobalSDKType, 'YT'>;
export type GlobalSDKSoundCloudKey = Extract<GlobalSDKType, 'SC'>;
export type GlobalSDKVimeoKey = Extract<GlobalSDKType, 'Vimeo'>;
export type GlobalSDKFacebookKey = Extract<GlobalSDKType, 'FB'>;
export type GlobalSDKPlayerJSKey = Extract<GlobalSDKType, 'playerjs'>;
export type GlobalSDKWistiaKey = Extract<GlobalSDKType, 'Wistia'>;
export type GlobalSDKTwitchKey = Extract<GlobalSDKType, 'Twitch'>;
export type GlobalSDKDailyMotionKey = Extract<GlobalSDKType, 'DM'>;
export type GlobalSDKMixcloudKey = Extract<GlobalSDKType, 'Mixcloud'>;
export type GlobalSDKVidyardKey = Extract<GlobalSDKType, 'VidyardV4'>;
export type GlobalSDKHLSKey = Extract<GlobalSDKType, 'Hls'>;
export type GlobalSDKDASHKey = Extract<GlobalSDKType, 'dashjs'>;
export type GlobalSDKFLVKey = Extract<GlobalSDKType, 'flvjs'>;

export type GlobalSDKValue = GlobalSDK[GlobalSDKType];

export type GlobalSDKYT = Extract<GlobalSDKValue, YT>;
export type GlobalSDKSoundCloud = Extract<GlobalSDKValue, SoundCloud>;
export type GlobalSDKVimeo = Extract<GlobalSDKValue, Vimeo>;
export type GlobalSDKFacebook = Extract<GlobalSDKValue, Facebook>;
export type GlobalSDKPlayerJS = Extract<GlobalSDKValue, PlayerJS>;
export type GlobalSDKWistia = Extract<GlobalSDKValue, Wistia>;
export type GlobalSDKTwitch = Extract<GlobalSDKValue, Twitch>;
export type GlobalSDKDailyMotion = Extract<GlobalSDKValue, DailyMotion>;
export type GlobalSDKMixcloud = Extract<GlobalSDKValue, MixcloudPlayer>;
export type GlobalSDKVidyard = Extract<GlobalSDKValue, Vidyard>;
export type GlobalSDKHLSClass = Hls;
export type GlobalSDKHLS = Extract<GlobalSDKValue, HlsJS>;
export type GlobalSDKDASH = Extract<GlobalSDKValue, DashJS>;
export type GlobalSDKFLV = Extract<GlobalSDKValue, FlvJS>;

export type GlobalSDKReady = YTSDKReady | DailyMotionSDKReady | FacebookSDKReady | VidyardSDKReady;

export type GlobalSDKYTReady = Extract<GlobalSDKReady, YTSDKReady>;
export type GlobalSDKDailyMotionReady = Extract<GlobalSDKReady, DailyMotionSDKReady>;
export type GlobalSDKFacebookReady = Extract<GlobalSDKReady, FacebookSDKReady>;
export type GlobalSDKVidyardReady = Extract<GlobalSDKReady, VidyardSDKReady>;
