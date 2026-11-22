import{Matrix3,Vector2,Color,mergeUniforms,Vector3,Mesh,BoxGeometry,ShaderMaterial,BackSide,cloneUniforms,Matrix4,ColorManagement,SRGBTransfer,PlaneGeometry,FrontSide,getUnlitUniformColorSpace,IntType,warn,HalfFloatType,UnsignedByteType,FloatType,RGBAFormat,Plane,WebGLRenderTarget,CubeTexture,NoBlending,LinearMipmapLinearFilter,LinearFilter,CubeCamera,floorPowerOfTwo,CubeReflectionMapping,CubeRefractionMapping,LinearSRGBColorSpace,EquirectangularReflectionMapping,EquirectangularRefractionMapping,warnOnce,Uint32BufferAttribute,Uint16BufferAttribute,error,DataArrayTexture,Vector4,BufferGeometry,Float32BufferAttribute,RawShaderMaterial,OrthographicCamera,DepthTexture,DepthStencilFormat,UnsignedInt248Type,NoToneMapping,CustomToneMapping,NeutralToneMapping,AgXToneMapping,ACESFilmicToneMapping,CineonToneMapping,ReinhardToneMapping,LinearToneMapping,Data3DTexture,AlwaysCompare,Texture,CubeDepthTexture,GLSL3,VSMShadowMap,PCFShadowMap,AddOperation,MixOperation,MultiplyOperation,LinearTransfer,UniformsUtils,DoubleSide,NormalBlending,TangentSpaceNormalMap,ObjectSpaceNormalMap,Layers,RGFormat,RG11_EAC_Format,RED_GREEN_RGTC2_Format,MeshDepthMaterial,MeshDistanceMaterial,BufferAttribute,PCFSoftShadowMap,DepthFormat,NearestFilter,UnsignedIntType,GreaterEqualCompare,LessEqualCompare,Frustum,LessEqualDepth,ReverseSubtractEquation,SubtractEquation,AddEquation,OneMinusConstantAlphaFactor,ConstantAlphaFactor,OneMinusConstantColorFactor,ConstantColorFactor,OneMinusDstAlphaFactor,OneMinusDstColorFactor,OneMinusSrcAlphaFactor,OneMinusSrcColorFactor,DstAlphaFactor,DstColorFactor,SrcAlphaSaturateFactor,SrcAlphaFactor,SrcColorFactor,OneFactor,ZeroFactor,NotEqualDepth,GreaterDepth,GreaterEqualDepth,EqualDepth,LessDepth,AlwaysDepth,NeverDepth,CullFaceNone,CullFaceBack,CullFaceFront,CustomBlending,MultiplyBlending,SubtractiveBlending,AdditiveBlending,ReversedDepthFuncs,MinEquation,MaxEquation,MirroredRepeatWrapping,ClampToEdgeWrapping,RepeatWrapping,LinearMipmapNearestFilter,NearestMipmapLinearFilter,NearestMipmapNearestFilter,NotEqualCompare,GreaterCompare,EqualCompare,LessCompare,NeverCompare,NoColorSpace,getByteLength,UnsignedShortType,createElementNS,UnsignedShort4444Type,UnsignedShort5551Type,UnsignedInt5999Type,UnsignedInt101111Type,ByteType,ShortType,AlphaFormat,RGBFormat,RedFormat,RedIntegerFormat,RGIntegerFormat,RGBAIntegerFormat,RGB_S3TC_DXT1_Format,RGBA_S3TC_DXT1_Format,RGBA_S3TC_DXT3_Format,RGBA_S3TC_DXT5_Format,RGB_PVRTC_4BPPV1_Format,RGB_PVRTC_2BPPV1_Format,RGBA_PVRTC_4BPPV1_Format,RGBA_PVRTC_2BPPV1_Format,RGB_ETC1_Format,RGB_ETC2_Format,RGBA_ETC2_EAC_Format,R11_EAC_Format,SIGNED_R11_EAC_Format,SIGNED_RG11_EAC_Format,RGBA_ASTC_4x4_Format,RGBA_ASTC_5x4_Format,RGBA_ASTC_5x5_Format,RGBA_ASTC_6x5_Format,RGBA_ASTC_6x6_Format,RGBA_ASTC_8x5_Format,RGBA_ASTC_8x6_Format,RGBA_ASTC_8x8_Format,RGBA_ASTC_10x5_Format,RGBA_ASTC_10x6_Format,RGBA_ASTC_10x8_Format,RGBA_ASTC_10x10_Format,RGBA_ASTC_12x10_Format,RGBA_ASTC_12x12_Format,RGBA_BPTC_Format,RGB_BPTC_SIGNED_Format,RGB_BPTC_UNSIGNED_Format,RED_RGTC1_Format,SIGNED_RED_RGTC1_Format,SIGNED_RED_GREEN_RGTC2_Format,ExternalTexture,EventDispatcher,PerspectiveCamera,ArrayCamera,WebXRController,RAD2DEG,DataTexture,createCanvasElement,SRGBColorSpace,REVISION,log,FrustumArray,WebGLCoordinateSystem,probeAsync}from"./three.core.js";export{AdditiveAnimationBlendMode,AlwaysStencilFunc,AmbientLight,AnimationAction,AnimationClip,AnimationLoader,AnimationMixer,AnimationObjectGroup,AnimationUtils,ArcCurve,ArrowHelper,AttachedBindMode,Audio,AudioAnalyser,AudioContext,AudioListener,AudioLoader,AxesHelper,BasicDepthPacking,BasicShadowMap,BatchedMesh,BezierInterpolant,Bone,BooleanKeyframeTrack,Box2,Box3,Box3Helper,BoxHelper,BufferGeometryLoader,Cache,Camera,CameraHelper,CanvasTexture,CapsuleGeometry,CatmullRomCurve3,CircleGeometry,Clock,ColorKeyframeTrack,Compatibility,CompressedArrayTexture,CompressedCubeTexture,CompressedTexture,CompressedTextureLoader,ConeGeometry,Controls,CubeTextureLoader,CubicBezierCurve,CubicBezierCurve3,CubicInterpolant,CullFaceFrontBack,Curve,CurvePath,CylinderGeometry,Cylindrical,DataTextureLoader,DataUtils,DecrementStencilOp,DecrementWrapStencilOp,DefaultLoadingManager,DetachedBindMode,DirectionalLight,DirectionalLightHelper,DiscreteInterpolant,DodecahedronGeometry,DynamicCopyUsage,DynamicDrawUsage,DynamicReadUsage,EdgesGeometry,EllipseCurve,EqualStencilFunc,Euler,ExtrudeGeometry,FileLoader,Float16BufferAttribute,Fog,FogExp2,FramebufferTexture,GLBufferAttribute,GLSL1,GreaterEqualStencilFunc,GreaterStencilFunc,GridHelper,Group,HTMLTexture,HemisphereLight,HemisphereLightHelper,IcosahedronGeometry,ImageBitmapLoader,ImageLoader,ImageUtils,IncrementStencilOp,IncrementWrapStencilOp,InstancedBufferAttribute,InstancedBufferGeometry,InstancedInterleavedBuffer,InstancedMesh,Int16BufferAttribute,Int32BufferAttribute,Int8BufferAttribute,InterleavedBuffer,InterleavedBufferAttribute,Interpolant,InterpolateBezier,InterpolateDiscrete,InterpolateLinear,InterpolateSmooth,InterpolationSamplingMode,InterpolationSamplingType,InvertStencilOp,KeepStencilOp,KeyframeTrack,LOD,LatheGeometry,LessEqualStencilFunc,LessStencilFunc,Light,LightProbe,LightShadow,Line,Line3,LineBasicMaterial,LineCurve,LineCurve3,LineDashedMaterial,LineLoop,LineSegments,LinearInterpolant,LinearMipMapLinearFilter,LinearMipMapNearestFilter,Loader,LoaderUtils,LoadingManager,LoopOnce,LoopPingPong,LoopRepeat,MOUSE,Material,MaterialBlending,MaterialLoader,MathUtils,Matrix2,MeshBasicMaterial,MeshLambertMaterial,MeshMatcapMaterial,MeshNormalMaterial,MeshPhongMaterial,MeshPhysicalMaterial,MeshStandardMaterial,MeshToonMaterial,NearestMipMapLinearFilter,NearestMipMapNearestFilter,NeverStencilFunc,NoNormalPacking,NormalAnimationBlendMode,NormalGAPacking,NormalRGPacking,NotEqualStencilFunc,NumberKeyframeTrack,Object3D,ObjectLoader,OctahedronGeometry,Path,PlaneHelper,PointLight,PointLightHelper,Points,PointsMaterial,PolarGridHelper,PolyhedronGeometry,PositionalAudio,PropertyBinding,PropertyMixer,QuadraticBezierCurve,QuadraticBezierCurve3,Quaternion,QuaternionKeyframeTrack,QuaternionLinearInterpolant,RGBADepthPacking,RGBDepthPacking,RGBIntegerFormat,RGDepthPacking,Ray,Raycaster,RectAreaLight,RenderObjectRefreshType,RenderTarget,RenderTarget3D,ReplaceStencilOp,RingGeometry,Scene,ShadowMaterial,Shape,ShapeGeometry,ShapePath,ShapeUtils,Skeleton,SkeletonHelper,SkinnedMesh,Source,Sphere,SphereGeometry,Spherical,SphericalHarmonics3,SplineCurve,SpotLight,SpotLightHelper,Sprite,SpriteMaterial,StaticCopyUsage,StaticDrawUsage,StaticReadUsage,StereoCamera,StreamCopyUsage,StreamDrawUsage,StreamReadUsage,StringKeyframeTrack,TOUCH,TetrahedronGeometry,TextureLoader,TextureSource,TextureUtils,Timer,TimestampQuery,TorusGeometry,TorusKnotGeometry,Triangle,TriangleFanDrawMode,TriangleStripDrawMode,TrianglesDrawMode,TubeGeometry,UVMapping,Uint8BufferAttribute,Uint8ClampedBufferAttribute,Uniform,UniformsGroup,VectorKeyframeTrack,VideoFrameTexture,VideoTexture,WebGL3DRenderTarget,WebGLArrayRenderTarget,WebGPUCoordinateSystem,WireframeGeometry,WrapAroundEnding,ZeroCurvatureEnding,ZeroSlopeEnding,ZeroStencilOp,getConsoleFunction,setConsoleFunction}from"./three.core.js";function WebGLAnimation(){let e=null,t=!1,n=null,s=null;function o(t,i){s=e.requestAnimationFrame(o),n(t,i)}return{start:function(){if(t===!0)return;if(n===null)return;if(e===null)return;s=e.requestAnimationFrame(o),t=!0},stop:function(){e!==null&&e.cancelAnimationFrame(s),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function WebGLAttributes(e){const t=new WeakMap;function n(t,n){const s=t.array,a=t.usage,r=s.byteLength,i=e.createBuffer();e.bindBuffer(n,i),e.bufferData(n,s,a),t.onUploadCallback();let o;if(s instanceof Float32Array)o=e.FLOAT;else if(typeof Float16Array!="undefined"&&s instanceof Float16Array)o=e.HALF_FLOAT;else if(s instanceof Uint16Array)t.isFloat16BufferAttribute?o=e.HALF_FLOAT:o=e.UNSIGNED_SHORT;else if(s instanceof Int16Array)o=e.SHORT;else if(s instanceof Uint32Array)o=e.UNSIGNED_INT;else if(s instanceof Int32Array)o=e.INT;else if(s instanceof Int8Array)o=e.BYTE;else if(s instanceof Uint8Array)o=e.UNSIGNED_BYTE;else if(s instanceof Uint8ClampedArray)o=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+s);return{buffer:i,type:o,bytesPerElement:s.BYTES_PER_ELEMENT,version:t.version,size:r}}function s(t,n,s){const i=n.array,o=n.updateRanges;if(e.bindBuffer(s,t),o.length===0)e.bufferSubData(s,0,i);else{o.sort((e,t)=>e.start-t.start);let t=0;for(let s=1;s<o.length;s++){const e=o[t],n=o[s];n.start<=e.start+e.count+1?e.count=Math.max(e.count,n.start+n.count-e.start):(++t,o[t]=n)}o.length=t+1;for(let t=0,a=o.length;t<a;t++){const n=o[t];e.bufferSubData(s,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function o(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function i(n){n.isInterleavedBufferAttribute&&(n=n.data);const s=t.get(n);s&&(e.deleteBuffer(s.buffer),t.delete(n))}function a(e,o){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){const n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}const i=t.get(e);if(i===0[0])t.set(e,n(e,o));else if(i.version<e.version){if(i.size!==e.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(i.buffer,e,o),i.version=e.version}}return{get:o,remove:i,update:a}}var alphahash_fragment=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment="gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_vertex=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,envmap_physical_pars_fragment=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,lights_toon_fragment=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vertex$h=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fragment$h=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fragment$g=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fragment$f=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$e=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,fragment$e=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vertex$d=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,fragment$d=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,vertex$c=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fragment$c=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$b=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fragment$b=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vertex$a=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,fragment$a=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$9=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fragment$9=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$8=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,fragment$8=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$7=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fragment$7=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,vertex$6=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fragment$6=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$5=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,fragment$5=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$4=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fragment$4=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vertex$3=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,fragment$3=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vertex$2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fragment$2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vertex$1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fragment$1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ShaderChunk={alphahash_fragment,alphahash_pars_fragment,alphamap_fragment,alphamap_pars_fragment,alphatest_fragment,alphatest_pars_fragment,aomap_fragment,aomap_pars_fragment,batching_pars_vertex,batching_vertex,begin_vertex,beginnormal_vertex,bsdfs,iridescence_fragment,bumpmap_pars_fragment,clipping_planes_fragment,clipping_planes_pars_fragment,clipping_planes_pars_vertex,clipping_planes_vertex,color_fragment,color_pars_fragment,color_pars_vertex,color_vertex,common,defaultnormal_vertex,displacementmap_pars_vertex,displacementmap_vertex,emissivemap_fragment,emissivemap_pars_fragment,colorspace_fragment,colorspace_pars_fragment,envmap_fragment,envmap_common_pars_fragment,envmap_pars_fragment,envmap_pars_vertex,envmap_physical_pars_fragment,envmap_vertex,fog_vertex,fog_pars_vertex,fog_fragment,fog_pars_fragment,gradientmap_pars_fragment,lightmap_pars_fragment,lights_lambert_fragment,lights_lambert_pars_fragment,lights_pars_begin,lights_toon_fragment,lights_toon_pars_fragment,lights_phong_fragment,lights_phong_pars_fragment,lights_physical_fragment,lights_physical_pars_fragment,lights_fragment_begin,lights_fragment_maps,lights_fragment_end,lightprobes_pars_fragment,logdepthbuf_fragment,logdepthbuf_pars_fragment,logdepthbuf_pars_vertex,logdepthbuf_vertex,map_fragment,map_pars_fragment,map_particle_fragment,map_particle_pars_fragment,metalnessmap_fragment,metalnessmap_pars_fragment,morphinstance_vertex,morphcolor_vertex,morphnormal_vertex,morphtarget_pars_vertex,morphtarget_vertex,normal_fragment_begin,normal_fragment_maps,normal_pars_fragment,normal_pars_vertex,normal_vertex,normalmap_pars_fragment,clearcoat_normal_fragment_begin,clearcoat_normal_fragment_maps,clearcoat_pars_fragment,iridescence_pars_fragment,opaque_fragment,packing,premultiplied_alpha_fragment,project_vertex,dithering_fragment,dithering_pars_fragment,roughnessmap_fragment,roughnessmap_pars_fragment,shadowmap_pars_fragment,shadowmap_pars_vertex,shadowmap_vertex,shadowmask_pars_fragment,skinbase_vertex,skinning_pars_vertex,skinning_vertex,skinnormal_vertex,specularmap_fragment,specularmap_pars_fragment,tonemapping_fragment,tonemapping_pars_fragment,transmission_fragment,transmission_pars_fragment,uv_pars_fragment,uv_pars_vertex,uv_vertex,worldpos_vertex,background_vert:vertex$h,background_frag:fragment$h,backgroundCube_vert:vertex$g,backgroundCube_frag:fragment$g,cube_vert:vertex$f,cube_frag:fragment$f,depth_vert:vertex$e,depth_frag:fragment$e,distance_vert:vertex$d,distance_frag:fragment$d,equirect_vert:vertex$c,equirect_frag:fragment$c,linedashed_vert:vertex$b,linedashed_frag:fragment$b,meshbasic_vert:vertex$a,meshbasic_frag:fragment$a,meshlambert_vert:vertex$9,meshlambert_frag:fragment$9,meshmatcap_vert:vertex$8,meshmatcap_frag:fragment$8,meshnormal_vert:vertex$7,meshnormal_frag:fragment$7,meshphong_vert:vertex$6,meshphong_frag:fragment$6,meshphysical_vert:vertex$5,meshphysical_frag:fragment$5,meshtoon_vert:vertex$4,meshtoon_frag:fragment$4,points_vert:vertex$3,points_frag:fragment$3,shadow_vert:vertex$2,shadow_frag:fragment$2,sprite_vert:vertex$1,sprite_frag:fragment$1},UniformsLib={common:{diffuse:{value:new Color(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Matrix3},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Matrix3}},envmap:{envMap:{value:null},envMapRotation:{value:new Matrix3},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Matrix3}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Matrix3}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Matrix3},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Matrix3},normalScale:{value:new Vector2(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Matrix3},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Matrix3}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Matrix3}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Matrix3}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Color(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Color(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0},uvTransform:{value:new Matrix3}},sprite:{diffuse:{value:new Color(16777215)},opacity:{value:1},center:{value:new Vector2(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Matrix3},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0}}},ShaderLib={basic:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.fog]),vertexShader:ShaderChunk.meshbasic_vert,fragmentShader:ShaderChunk.meshbasic_frag},lambert:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)},envMapIntensity:{value:1}}]),vertexShader:ShaderChunk.meshlambert_vert,fragmentShader:ShaderChunk.meshlambert_frag},phong:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)},specular:{value:new Color(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ShaderChunk.meshphong_vert,fragmentShader:ShaderChunk.meshphong_frag},standard:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.roughnessmap,UniformsLib.metalnessmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ShaderChunk.meshphysical_vert,fragmentShader:ShaderChunk.meshphysical_frag},toon:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.gradientmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)}}]),vertexShader:ShaderChunk.meshtoon_vert,fragmentShader:ShaderChunk.meshtoon_frag},matcap:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,{matcap:{value:null}}]),vertexShader:ShaderChunk.meshmatcap_vert,fragmentShader:ShaderChunk.meshmatcap_frag},points:{uniforms:mergeUniforms([UniformsLib.points,UniformsLib.fog]),vertexShader:ShaderChunk.points_vert,fragmentShader:ShaderChunk.points_frag},dashed:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ShaderChunk.linedashed_vert,fragmentShader:ShaderChunk.linedashed_frag},depth:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.displacementmap]),vertexShader:ShaderChunk.depth_vert,fragmentShader:ShaderChunk.depth_frag},normal:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,{opacity:{value:1}}]),vertexShader:ShaderChunk.meshnormal_vert,fragmentShader:ShaderChunk.meshnormal_frag},sprite:{uniforms:mergeUniforms([UniformsLib.sprite,UniformsLib.fog]),vertexShader:ShaderChunk.sprite_vert,fragmentShader:ShaderChunk.sprite_frag},background:{uniforms:{uvTransform:{value:new Matrix3},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ShaderChunk.background_vert,fragmentShader:ShaderChunk.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Matrix3}},vertexShader:ShaderChunk.backgroundCube_vert,fragmentShader:ShaderChunk.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ShaderChunk.cube_vert,fragmentShader:ShaderChunk.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ShaderChunk.equirect_vert,fragmentShader:ShaderChunk.equirect_frag},distance:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.displacementmap,{referencePosition:{value:new Vector3},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ShaderChunk.distance_vert,fragmentShader:ShaderChunk.distance_frag},shadow:{uniforms:mergeUniforms([UniformsLib.lights,UniformsLib.fog,{color:{value:new Color(0)},opacity:{value:1}}]),vertexShader:ShaderChunk.shadow_vert,fragmentShader:ShaderChunk.shadow_frag}};ShaderLib.physical={uniforms:mergeUniforms([ShaderLib.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Matrix3},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Matrix3},clearcoatNormalScale:{value:new Vector2(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Matrix3},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Matrix3},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Matrix3},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Matrix3},sheen:{value:0},sheenColor:{value:new Color(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Matrix3},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Matrix3},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Matrix3},transmissionSamplerSize:{value:new Vector2},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Matrix3},attenuationDistance:{value:0},attenuationColor:{value:new Color(0)},specularColor:{value:new Color(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Matrix3},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Matrix3},anisotropyVector:{value:new Vector2},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Matrix3}}]),vertexShader:ShaderChunk.meshphysical_vert,fragmentShader:ShaderChunk.meshphysical_frag};const _rgb={r:0,b:0,g:0},_m1$1=new Matrix4,_m$1=new Matrix3;_m$1.set(-1,0,0,0,1,0,0,0,1);function WebGLBackground(e,t,n,s,o,i){const l=new Color(0);let c=o===!0?0:1,r,a,d=null,u=0,h=null;function f(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){const s=e.backgroundBlurriness>0;n=t.get(n,s)}return n}function p(t){let o=!1;const s=f(t);s===null?m(l,c):s&&s.isColor&&(m(s,1),o=!0);const a=e.xr.getEnvironmentBlendMode();a==="additive"?n.buffers.color.setClear(0,0,0,1,i):a==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,i),(e.autoClear||o)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){const o=f(n);o&&o.isCubeTexture?(a===0[0]&&(a=new Mesh(new BoxGeometry(1,1,1),new ShaderMaterial({name:"BackgroundCubeMaterial",uniforms:cloneUniforms(ShaderLib.backgroundCube.uniforms),vertexShader:ShaderLib.backgroundCube.vertexShader,fragmentShader:ShaderLib.backgroundCube.fragmentShader,side:BackSide,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),a.geometry.deleteAttribute("normal"),a.geometry.deleteAttribute("uv"),a.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(a.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(a)),a.material.uniforms.envMap.value=o,a.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,a.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,a.material.uniforms.backgroundRotation.value.setFromMatrix4(_m1$1.makeRotationFromEuler(n.backgroundRotation)).transpose(),o.isRenderTargetTexture===!1&&a.material.uniforms.backgroundRotation.value.premultiply(_m$1),a.material.toneMapped=ColorManagement.getTransfer(o.colorSpace)!==SRGBTransfer,(d!==o||u!==o.version||h!==e.toneMapping)&&(a.material.needsUpdate=!0,d=o,u=o.version,h=e.toneMapping),a.layers.enableAll(),t.unshift(a,a.geometry,a.material,0,0,null)):o&&o.isTexture&&(r===0[0]&&(r=new Mesh(new PlaneGeometry(2,2),new ShaderMaterial({name:"BackgroundMaterial",uniforms:cloneUniforms(ShaderLib.background.uniforms),vertexShader:ShaderLib.background.vertexShader,fragmentShader:ShaderLib.background.fragmentShader,side:FrontSide,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),r.geometry.deleteAttribute("normal"),Object.defineProperty(r.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(r)),r.material.uniforms.t2D.value=o,r.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,r.material.toneMapped=ColorManagement.getTransfer(o.colorSpace)!==SRGBTransfer,o.matrixAutoUpdate===!0&&o.updateMatrix(),r.material.uniforms.uvTransform.value.copy(o.matrix),(d!==o||u!==o.version||h!==e.toneMapping)&&(r.material.needsUpdate=!0,d=o,u=o.version,h=e.toneMapping),r.layers.enableAll(),t.unshift(r,r.geometry,r.material,0,0,null))}function m(t,s){t.getRGB(_rgb,getUnlitUniformColorSpace(e)),n.buffers.color.setClear(_rgb.r,_rgb.g,_rgb.b,s,i)}function v(){a!==0[0]&&(a.geometry.dispose(),a.material.dispose(),a=0[0]),r!==0[0]&&(r.geometry.dispose(),r.material.dispose(),r=0[0])}return{getClearColor:function(){return l},setClearColor:function(e,t=1){l.set(e),c=t,m(l,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,m(l,c)},render:p,addToRenderList:g,dispose:v}}function WebGLBindingStates(e,t){const v=e.getParameter(e.MAX_VERTEX_ATTRIBS),s={},o=h(null);let n=o,a=!1;function E(s,o,i,r,c){let l=!1;const u=j(s,r,i,o);n!==u&&(n=u,d(n.object)),l=b(s,r,i,c),l&&g(s,r,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(l||a)&&(a=!1,y(s,o,i,r),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function C(){return e.createVertexArray()}function d(t){return e.bindVertexArray(t)}function i(t){return e.deleteVertexArray(t)}function j(e,t,n,o){const l=o.wireframe===!0;let i=s[t.id];i===0[0]&&(i={},s[t.id]=i);const d=e.isInstancedMesh===!0?e.id:0;let a=i[d];a===0[0]&&(a={},i[d]=a);let r=a[n.id];r===0[0]&&(r={},a[n.id]=r);let c=r[l];return c===0[0]&&(c=h(C()),r[l]=c),c}function h(e){const t=[],n=[],s=[];for(let e=0;e<v;e++)t[e]=0,n[e]=0,s[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:n,attributeDivisors:s,object:e,attributes:{},index:null}}function b(e,t,s,o){const r=n.attributes,c=t.attributes;let i=0;const a=s.getAttributes();for(const t in a){const n=a[t];if(n.location>=0){const s=r[t];let n=c[t];if(n===0[0]&&(t==="instanceMatrix"&&e.instanceMatrix&&(n=e.instanceMatrix),t==="instanceColor"&&e.instanceColor&&(n=e.instanceColor)),s===0[0])return!0;if(s.attribute!==n)return!0;if(n&&s.data!==n.data)return!0;i++}}return n.attributesNum!==i||n.index!==o}function g(e,t,s,o){const i={},c=t.attributes;let a=0;const r=s.getAttributes();for(const t in r){const n=r[t];if(n.location>=0){let n=c[t];n===0[0]&&(t==="instanceMatrix"&&e.instanceMatrix&&(n=e.instanceMatrix),t==="instanceColor"&&e.instanceColor&&(n=e.instanceColor));const s={};s.attribute=n,n&&n.data&&(s.data=n.data),i[t]=s,a++}}n.attributes=i,n.attributesNum=a,n.index=o}function p(){const e=n.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function c(e){r(e,0)}function r(t,s){const a=n.newAttributes,o=n.enabledAttributes,i=n.attributeDivisors;a[t]=1,o[t]===0&&(e.enableVertexAttribArray(t),o[t]=1),i[t]!==s&&(e.vertexAttribDivisor(t,s),i[t]=s)}function m(){const s=n.newAttributes,t=n.enabledAttributes;for(let n=0,o=t.length;n<o;n++)t[n]!==s[n]&&(e.disableVertexAttribArray(n),t[n]=0)}function u(t,n,s,o,i,a,r){r===!0?e.vertexAttribIPointer(t,n,s,i,a):e.vertexAttribPointer(t,n,s,o,i,a)}function y(n,s,o,i){p();const d=i.attributes,a=o.getAttributes(),l=s.defaultAttributeValues;for(const o in a){const s=a[o];if(s.location>=0){let a=d[o];if(a===0[0]&&(o==="instanceMatrix"&&n.instanceMatrix&&(a=n.instanceMatrix),o==="instanceColor"&&n.instanceColor&&(a=n.instanceColor)),a!==0[0]){const m=a.normalized,o=a.itemSize,l=t.get(a);if(l===0[0])continue;const f=l.buffer,d=l.type,h=l.bytesPerElement,p=d===e.INT||d===e.UNSIGNED_INT||a.gpuType===IntType;if(a.isInterleavedBufferAttribute){const t=a.data,l=t.isInterleavedBuffer===!0?t.stride:t.itemSize,g=a.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<s.locationSize;e++)r(s.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&i._maxInstanceCount===0[0]&&(i._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<s.locationSize;e++)c(s.location+e);e.bindBuffer(e.ARRAY_BUFFER,f);for(let e=0;e<s.locationSize;e++)u(s.location+e,o/s.locationSize,d,m,l*h,(g+o/s.locationSize*e)*h,p)}else{if(a.isInstancedBufferAttribute){for(let e=0;e<s.locationSize;e++)r(s.location+e,a.meshPerAttribute);n.isInstancedMesh!==!0&&i._maxInstanceCount===0[0]&&(i._maxInstanceCount=a.meshPerAttribute*a.count)}else for(let e=0;e<s.locationSize;e++)c(s.location+e);e.bindBuffer(e.ARRAY_BUFFER,f);for(let e=0;e<s.locationSize;e++)u(s.location+e,o/s.locationSize,d,m,o*h,o/s.locationSize*e*h,p)}}else if(l!==0[0]){const t=l[o];if(t!==0[0])switch(t.length){case 2:e.vertexAttrib2fv(s.location,t);break;case 3:e.vertexAttrib3fv(s.location,t);break;case 4:e.vertexAttrib4fv(s.location,t);break;default:e.vertexAttrib1fv(s.location,t)}}}}m()}function _(){l();for(const e in s){const t=s[e];for(const n in t){const e=t[n];for(const n in e){const t=e[n];for(const e in t)i(t[e].object),delete t[e];delete e[n]}}delete s[e]}}function w(e){if(s[e.id]===0[0])return;const t=s[e.id];for(const n in t){const e=t[n];for(const n in e){const t=e[n];for(const e in t)i(t[e].object),delete t[e];delete e[n]}}delete s[e.id]}function O(e){for(const n in s){const t=s[n];for(const o in t){const n=t[o];if(n[e.id]===0[0])continue;const s=n[e.id];for(const e in s)i(s[e].object),delete s[e];delete n[e.id]}}}function x(e){for(const o in s){const n=s[o],a=e.isInstancedMesh===!0?e.id:0,t=n[a];if(t===0[0])continue;for(const n in t){const e=t[n];for(const t in e)i(e[t].object),delete e[t];delete t[n]}delete n[a],Object.keys(n).length===0&&delete s[o]}}function l(){if(f(),a=!0,n===o)return;n=o,d(n.object)}function f(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:E,reset:l,resetDefaultState:f,dispose:_,releaseStatesOfGeometry:w,releaseStatesOfObject:x,releaseStatesOfProgram:O,initAttributes:p,enableAttribute:c,disableUnusedAttributes:m}}function WebGLBufferRenderer(e,t,n){let s;function o(e){s=e}function i(t,o){e.drawArrays(s,t,o),n.update(o,s,1)}function a(t,o,i){if(i===0)return;e.drawArraysInstanced(s,t,o,i),n.update(o,s,i)}function r(e,o,i){if(i===0)return;const r=t.get("WEBGL_multi_draw");r.multiDrawArraysWEBGL(s,e,0,o,0,i);let a=0;for(let e=0;e<i;e++)a+=o[e];n.update(a,s,1)}this.setMode=o,this.render=i,this.renderInstances=a,this.renderMultiDraw=r}function WebGLCapabilities(e,t,n,s){let i;function h(){if(i!==0[0])return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const n=t.get("EXT_texture_filter_anisotropic");i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function u(t){return t===RGBAFormat||s.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function g(n){const o=n===HalfFloatType&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(n!==UnsignedByteType&&n!==FloatType&&!o&&s.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";t="mediump"}return t==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=n.precision!==0[0]?n.precision:"highp";const r=c(o);r!==o&&(warn("WebGLRenderer:",o,"not supported, using",r,"instead."),o=r);const a=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),l=n.logarithmicDepthBuffer===!0&&a===!1;n.reversedDepthBuffer===!0&&a===!1&&warn("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),n.logarithmicDepthBuffer===!0&&a===!0&&warn("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const m=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),f=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=e.getParameter(e.MAX_TEXTURE_SIZE),d=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),v=e.getParameter(e.MAX_VERTEX_ATTRIBS),b=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),j=e.getParameter(e.MAX_VARYING_VECTORS),y=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),_=e.getParameter(e.MAX_SAMPLES),w=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:h,getMaxPrecision:c,textureFormatReadable:u,textureTypeReadable:g,precision:o,logarithmicDepthBuffer:l,reversedDepthBuffer:a,maxTextures:m,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:d,maxAttributes:v,maxVertexUniforms:b,maxVaryings:j,maxFragmentUniforms:y,maxSamples:_,samples:w}}function WebGLClipping(e){const o=this;let i=null,n=0,r=!1,s=!1;const c=new Plane,l=new Matrix3,t={value:null,needsUpdate:!1};this.uniform=t,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){const s=e.length!==0||t||n!==0||r;return r=t,n=e.length,s},this.beginShadows=function(){s=!0,a(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(e,t){i=a(e,t,0)},this.setState=function(o,c,l){const u=o.clippingPlanes,m=o.clipIntersection,f=o.clipShadows,h=e.get(o);if(!r||u===null||u.length===0||s&&!f)s?a(null):d();else{const o=s?0:n,r=o*4;let e=h.clippingState||null;t.value=e,e=a(u,c,r,l);for(let t=0;t!==r;++t)e[t]=i[t];h.clippingState=e,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=o}};function d(){t.value!==i&&(t.value=i,t.needsUpdate=n>0),o.numPlanes=n,o.numIntersection=0}function a(e,n,s,i){const r=e!==null?e.length:0;let a=null;if(r!==0){if(a=t.value,i!==!0||a===null){const t=s+r*4,o=n.matrixWorldInverse;l.getNormalMatrix(o),(a===null||a.length<t)&&(a=new Float32Array(t));for(let t=0,n=s;t!==r;++t,n+=4)c.copy(e[t]).applyMatrix4(o,l),c.normal.toArray(a,n),a[n+3]=c.constant}t.value=a,t.needsUpdate=!0}return o.numPlanes=r,o.numIntersection=0,a}}class WebGLCubeRenderTarget extends WebGLRenderTarget{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new CubeTexture(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new BoxGeometry(5,5,5),o=new ShaderMaterial({name:"CubemapFromEquirect",uniforms:cloneUniforms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:BackSide,blending:NoBlending});o.uniforms.tEquirect.value=t;const s=new Mesh(i,o),a=t.minFilter;t.minFilter===LinearMipmapLinearFilter&&(t.minFilter=LinearFilter);const r=new CubeCamera(1,10,this);return r.update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const o=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(o)}}const MIN_SIZE=256,LOD_MIN=3,BLUR_SAMPLES=20,GGX_SAMPLES=256,INTEGRATION_SIZE=16,INTEGRATION_LEVELS=3,_origin=new Vector3,_clearColor=new Color;class PMREMGenerator{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new CubeCamera(1,10,null),this._boxMesh=new Mesh(new BoxGeometry(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,o={}){const{size:d=256,position:u=_origin}=o,i=this._renderer;this._setSize(d);const a=this._allocateTarget(),r=this._getSourceTarget(!0);t>0&&(r.texture.mipmapsAutoUpdate=!1);const h=i.autoClear,m=i.autoClearColor,f=i.autoClearDepth,p=i.autoClearStencil,c=e.background;i.autoClear=!0,i.autoClearColor=!0,i.autoClearDepth=!0,i.autoClearStencil=!0,c===null&&(e.background=i.getClearColor(_clearColor));const l=new CubeCamera(n,s,r);return l.position.copy(u),l.update(i,e),i.autoClear=h,i.autoClearColor=m,i.autoClearDepth=f,i.autoClearStencil=p,e.background=c,t>0&&(r.texture.mipmapsAutoUpdate=!0,this._blur(a,t)),this._applyPMREM(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_getCubemapMaterial(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_getEquirectMaterial(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(MIN_SIZE,floorPowerOfTwo(e))}_fromTexture(e,t){e.mapping===CubeReflectionMapping||e.mapping===CubeRefractionMapping?this._setSize(e.image.length===0?MIN_SIZE:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){const e=this._cubeSize,t=_createRenderTarget(e,!1,!1),n=Math.log2(e)-LOD_MIN;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const n=this._cubeSize,t=this._sourceTarget;return(t===null||t.width!==n||e&&t.depthBuffer===!1)&&(t!==null&&t.dispose(),this._sourceTarget=_createRenderTarget(n,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){const o=this._boxMesh,s=this._cubeCamera;o.material=n,s.renderTarget=e,s.activeMipmapLevel=t;const i=e.width>>t;e.viewport.set(0,0,i,i),s.update(this._renderer,o),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===CubeReflectionMapping||e.mapping===CubeRefractionMapping?(this._cubemapMaterial===null&&(this._cubemapMaterial=_getCubemapMaterial()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=_getEquirectMaterial()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=_getGGXMaterial(),this._integrationMaterial=_getIntegrationMaterial());const o=this._cubeSize,t=e.texture.mipmaps.length-1,n=this._ggxMaterial.uniforms;n.envMap.value=this._sourceTarget.texture;const s=this._integrationMaterial.uniforms;s.envMap.value=this._sourceTarget.texture,s.sourceLod.value=Math.log2(o/INTEGRATION_SIZE);for(let i=0;i<=t;i++){const a=PMREMGenerator.lodToRoughness(i,t);if(i>t-INTEGRATION_LEVELS)s.roughness.value=a,this._renderCube(e,i,this._integrationMaterial);else{const t=a>0?Math.log2(o)+.5*Math.log2(6/(GGX_SAMPLES*a**4))+.5:0;n.roughness.value=a,n.lodBias.value=t,this._renderCube(e,i,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=_getBlurMaterial());const n=this._blurMaterial,s=n.uniforms,o=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=o.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(o,0,n)}}function _createRenderTarget(e,t,n){return new WebGLCubeRenderTarget(e,{minFilter:LinearMipmapLinearFilter,generateMipmaps:t,type:HalfFloatType,colorSpace:LinearSRGBColorSpace,depthBuffer:n})}function _getMaterial(e,t,n){return new ShaderMaterial({name:e,uniforms:t,vertexShader:ShaderChunk.cube_vert,fragmentShader:n,side:BackSide,blending:NoBlending,depthTest:!1,depthWrite:!1})}function _getGGXMaterial(){return _getMaterial("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${GGX_SAMPLES}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function _getIntegrationMaterial(){return _getMaterial("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:INTEGRATION_SIZE}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function _getBlurMaterial(){return _getMaterial("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${BLUR_SAMPLES}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function _getEquirectMaterial(){return _getMaterial("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function _getCubemapMaterial(){return _getMaterial("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function WebGLEnvironments(e){let n=new WeakMap,s=new WeakMap,t=null;function r(e,t=!1){return e==null?null:t?l(e):c(e)}function c(t){if(t&&t.isTexture){const s=t.mapping;if(s===EquirectangularReflectionMapping||s===EquirectangularRefractionMapping){if(n.has(t)){const e=n.get(t).texture;return o(e,t.mapping)}const s=t.image;if(s&&s.height>0){const a=new WebGLCubeRenderTarget(s.height);return a.fromEquirectangularTexture(e,t),n.set(t,a),t.addEventListener("dispose",i),o(a.texture,t.mapping)}return null}}return t}function l(n){if(n&&n.isTexture&&n.isPMREMTexture!==!0){const o=n.mapping,i=o===EquirectangularReflectionMapping||o===EquirectangularRefractionMapping,r=o===CubeReflectionMapping||o===CubeRefractionMapping;if(i||r){let o=s.get(n);const c=o!==0[0]?o.texture.pmremVersion:0;if(n.isRenderTargetTexture&&n.pmremVersion!==c)return t===null&&(t=new PMREMGenerator(e)),o=i?t.fromEquirectangular(n,o):t.fromCubemap(n,o),o.texture.pmremVersion=n.pmremVersion,s.set(n,o),o.texture;if(o!==0[0])return o.texture;const image=n.image;return i&&image&&image.height>0||r&&image&&d(image)?(t===null&&(t=new PMREMGenerator(e)),o=i?t.fromEquirectangular(n):t.fromCubemap(n),o.texture.pmremVersion=n.pmremVersion,s.set(n,o),n.addEventListener("dispose",a),o.texture):null}}return n}function o(e,t){return t===EquirectangularReflectionMapping?e.mapping=CubeReflectionMapping:t===EquirectangularRefractionMapping&&(e.mapping=CubeRefractionMapping),e}function d(e){let t=0;const n=6;for(let s=0;s<n;s++)e[s]!==0[0]&&t++;return t===n}function i(e){const t=e.target;t.removeEventListener("dispose",i);const s=n.get(t);s!==0[0]&&(n.delete(t),s.dispose())}function a(e){const t=e.target;t.removeEventListener("dispose",a);const n=s.get(t);n!==0[0]&&(s.delete(t),n.dispose())}function u(){n=new WeakMap,s=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:r,dispose:u}}function WebGLExtensions(e){const n={};function t(t){if(n[t]!==0[0])return n[t];const s=e.getExtension(t);return n[t]=s,s}return{has:function(e){return t(e)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(e){const n=t(e);return n===null&&warnOnce("WebGLRenderer: "+e+" extension not supported."),n}}}function WebGLGeometries(e,t,n,s){const o={},i=new WeakMap,a=new FinalizationRegistry(e=>delete o[e]);function r(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(const n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener("dispose",r),delete o[e.id],a.unregister(e);const c=i.get(e);c&&(t.remove(c),i.delete(e)),s.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function d(e,t){return o[t.id]!==0[0]?t:(t.addEventListener("dispose",r),o[t.id]=new WeakRef(t),a.register(t,t.id,t),n.memory.geometries++,t)}function u(n){const s=n.attributes;for(const n in s)t.update(s[n],e.ARRAY_BUFFER)}function l(e){const s=e.index,o=e.attributes.position;let a=0;if(o===0[0])return;const r=s!==null?s.array.length:o.array.length/3-1,d=o.count>=65535?Uint32BufferAttribute:Uint16BufferAttribute,c=new d(Math.ceil(r/3)*6,1),n=c.array;if(s!==null){const e=s.array;a=s.version;for(let s=0,t=0;s<r;s+=3){const o=e[s+0],i=e[s+1],a=e[s+2];n[t++]=o,n[t++]=i,n[t++]=i,n[t++]=a,n[t++]=a,n[t++]=o}}else{a=o.version;for(let t=0,e=0;t<r;t+=3){const s=t+0,o=t+1,i=t+2;n[e++]=s,n[e++]=o,n[e++]=o,n[e++]=i,n[e++]=i,n[e++]=s}}c.version=a;const l=i.get(e);l&&t.remove(l),i.set(e,c)}function h(e){const t=i.get(e);if(t){const n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return i.get(e)}function m(){for(const t in o){const e=o[t].deref();e!==0[0]&&c(e)}}return{get:d,update:u,getWireframeAttribute:h,dispose:m}}function WebGLIndexedBufferRenderer(e,t,n){let s;function a(e){s=e}let o,i;function r(e){o=e.type,i=e.bytesPerElement}function c(t,a){e.drawElements(s,a,o,t*i),n.update(a,s,1)}function l(t,a,r){if(r===0)return;e.drawElementsInstanced(s,a,o,t*i,r),n.update(a,s,r)}function d(e,i,a){if(a===0)return;const c=t.get("WEBGL_multi_draw");c.multiDrawElementsWEBGL(s,i,0,o,e,0,a);let r=0;for(let e=0;e<a;e++)r+=i[e];n.update(r,s,1)}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d}function WebGLInfo(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function s(n,s,o){switch(t.calls++,s){case e.TRIANGLES:t.triangles+=o*(n/3);break;case e.LINES:t.lines+=o*(n/2);break;case e.LINE_STRIP:t.lines+=o*(n-1);break;case e.LINE_LOOP:t.lines+=o*n;break;case e.POINTS:t.points+=o*n;break;default:error("WebGLInfo: Unknown draw mode:",s);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:o,update:s}}function WebGLMorphtargets(e,t,n){const o=new WeakMap,s=new Vector4;function i(i,a,r){const d=i.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,l=u!==0[0]?u.length:0;let c=o.get(a);if(c===0[0]||c.count!==l){c!==0[0]&&c.texture.dispose();const u=a.morphAttributes.position!==0[0],m=a.morphAttributes.normal!==0[0],f=a.morphAttributes.color!==0[0],p=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let i=0;u===!0&&(i=1),m===!0&&(i=2),f===!0&&(i=3);let n=a.attributes.position.count*i,r=1;n>t.maxTextureSize&&(r=Math.ceil(n/t.maxTextureSize),n=t.maxTextureSize);const e=new Float32Array(n*r*4*l),d=new DataArrayTexture(e,n,r,l);d.type=FloatType,d.needsUpdate=!0;const b=i*4;for(let o=0;o<l;o++){const i=p[o],c=g[o],a=v[o],t=n*r*4*o;for(let o=0;o<i.count;o++){const n=o*b;u===!0&&(s.fromBufferAttribute(i,o),e[t+n+0]=s.x,e[t+n+1]=s.y,e[t+n+2]=s.z,e[t+n+3]=0),m===!0&&(s.fromBufferAttribute(c,o),e[t+n+4]=s.x,e[t+n+5]=s.y,e[t+n+6]=s.z,e[t+n+7]=0),f===!0&&(s.fromBufferAttribute(a,o),e[t+n+8]=s.x,e[t+n+9]=s.y,e[t+n+10]=s.z,e[t+n+11]=a.itemSize===4?s.w:1)}}c={count:l,texture:d,size:new Vector2(n,r)},o.set(a,c);function h(){d.dispose(),o.delete(a),a.removeEventListener("dispose",h)}a.addEventListener("dispose",h)}if(i.isInstancedMesh===!0&&i.morphTexture!==null)r.getUniforms().setValue(e,"morphTexture",i.morphTexture,n);else{let t=0;for(let e=0;e<d.length;e++)t+=d[e];const n=a.morphTargetsRelative?1:1-t;r.getUniforms().setValue(e,"morphTargetBaseInfluence",n),r.getUniforms().setValue(e,"morphTargetInfluences",d)}r.getUniforms().setValue(e,"morphTargetsTexture",c.texture,n),r.getUniforms().setValue(e,"morphTargetsTextureSize",c.size)}return{update:i}}function WebGLObjects(e,t,n,s,o){let i=new WeakMap;function r(s){const r=o.render.frame,l=s.geometry,c=t.get(s,l);if(i.get(c)!==r&&(t.update(c),i.set(c,r)),s.isInstancedMesh&&(s.hasEventListener("dispose",a)===!1&&s.addEventListener("dispose",a),i.get(s)!==r&&(n.update(s.instanceMatrix,e.ARRAY_BUFFER),s.instanceColor!==null&&n.update(s.instanceColor,e.ARRAY_BUFFER),i.set(s,r))),s.isSkinnedMesh){const e=s.skeleton;i.get(e)!==r&&(e.update(),i.set(e,r))}return c}function c(){i=new WeakMap}function a(e){const t=e.target;t.removeEventListener("dispose",a),s.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:r,dispose:c}}const toneMappingMap={[LinearToneMapping]:"LINEAR_TONE_MAPPING",[ReinhardToneMapping]:"REINHARD_TONE_MAPPING",[CineonToneMapping]:"CINEON_TONE_MAPPING",[ACESFilmicToneMapping]:"ACES_FILMIC_TONE_MAPPING",[AgXToneMapping]:"AGX_TONE_MAPPING",[NeutralToneMapping]:"NEUTRAL_TONE_MAPPING",[CustomToneMapping]:"CUSTOM_TONE_MAPPING"};function WebGLOutput(e,t,n,s,o,i){const a=new WebGLRenderTarget(t,n,{type:e,depthBuffer:o,stencilBuffer:i,samples:s?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let c=null,d=null,u=null;const h=new BufferGeometry;h.setAttribute("position",new Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Float32BufferAttribute([0,2,0,0,2,0],2));const l=new RawShaderMaterial({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),y=new Mesh(h,l),j=new OrthographicCamera(-1,1,1,-1,0,1);let p=null,f=null,m=!1,b,g=null,r=[],v=!1;this.setSize=function(e,t){a.setSize(e,t),c!==null&&c.setSize(e,t),d!==null&&d.setSize(e,t);for(let n=0;n<r.length;n++){const s=r[n];s.setSize&&s.setSize(e,t)}},this.setEffects=function(e){r=e,v=r.length>0&&r[0].isRenderPass===!0;const n=a.width,s=a.height;r.length>0&&c===null&&(c=new WebGLRenderTarget(n,s,{type:HalfFloatType,depthBuffer:!1,stencilBuffer:!1}),d=new WebGLRenderTarget(n,s,{type:HalfFloatType,depthBuffer:!1,stencilBuffer:!1}));const t=o===!0&&r.some(e=>e.needsDepthTexture===!0);t!==(a.depthTexture!==null)&&(t===!0&&u===null&&(u=new DepthTexture(n,s),i===!0&&(u.format=DepthStencilFormat,u.type=UnsignedInt248Type)),a.dispose(),a.depthTexture=t?u:null,a.resolveDepthBuffer=t,a.storeMultisampledDepthBuffer=t);for(let o=0;o<r.length;o++){const e=r[o];e.setSize&&e.setSize(n,s),t&&e.needsDepthTexture===!0&&e.setDepthTexture&&e.setDepthTexture(u)}},this.begin=function(e,t){if(m)return!1;if(e.toneMapping===NoToneMapping&&r.length===0)return!1;if(g=t,t!==null){const e=t.width,n=t.height;(a.width!==e||a.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(a),b=e.toneMapping,e.toneMapping=NoToneMapping,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=b,m=!0;let s=a,n=c;for(let o=0;o<r.length;o++){const i=r[o];if(i.enabled===!1)continue;i.render(e,n,s,t),i.needsSwap!==!1&&(s=n,n=n===c?d:c)}if(p!==e.outputColorSpace||f!==e.toneMapping){p=e.outputColorSpace,f=e.toneMapping,l.defines={},ColorManagement.getTransfer(p)===SRGBTransfer&&(l.defines.SRGB_TRANSFER="");const t=toneMappingMap[f];t&&(l.defines[t]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=s.texture,e.setRenderTarget(g),e.render(y,j),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),c!==null&&c.dispose(),d!==null&&d.dispose(),h.dispose(),l.dispose()}}const emptyTexture=new Texture,emptyShadowTexture=new DepthTexture(1,1),emptyCubeShadowTexture=new CubeDepthTexture(1),emptyArrayTexture=new DataArrayTexture,empty3dTexture=new Data3DTexture,emptyCubeTexture=new CubeTexture,arrayCacheF32=[],arrayCacheI32=[],mat4array=new Float32Array(16),mat3array=new Float32Array(9),mat2array=new Float32Array(4);function flatten(e,t,n){const o=e[0];if(o<=0||o>0)return e;const i=t*n;let s=arrayCacheF32[i];if(s===0[0]&&(s=new Float32Array(i),arrayCacheF32[i]=s),t!==0){o.toArray(s,0);for(let o=1,i=0;o!==t;++o)i+=n,e[o].toArray(s,i)}return s}function arraysEqual(e,t){if(e.length!==t.length)return!1;for(let n=0,s=e.length;n<s;n++)if(e[n]!==t[n])return!1;return!0}function copyArray(e,t){for(let n=0,s=t.length;n<s;n++)e[n]=t[n]}function allocTexUnits(e,t){let n=arrayCacheI32[t];n===0[0]&&(n=new Int32Array(t),arrayCacheI32[t]=n);for(let s=0;s!==t;++s)n[s]=e.allocateTextureUnit();return n}function setValueV1f(e,t){const n=this.cache;if(n[0]===t)return;e.uniform1f(this.addr,t),n[0]=t}function setValueV2f(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(arraysEqual(n,t))return;e.uniform2fv(this.addr,t),copyArray(n,t)}}function setValueV3f(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==0[0])(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(arraysEqual(n,t))return;e.uniform3fv(this.addr,t),copyArray(n,t)}}function setValueV4f(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(arraysEqual(n,t))return;e.uniform4fv(this.addr,t),copyArray(n,t)}}function setValueM2(e,t){const n=this.cache,s=t.elements;if(s===0[0]){if(arraysEqual(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),copyArray(n,t)}else{if(arraysEqual(n,s))return;mat2array.set(s),e.uniformMatrix2fv(this.addr,!1,mat2array),copyArray(n,s)}}function setValueM3(e,t){const n=this.cache,s=t.elements;if(s===0[0]){if(arraysEqual(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),copyArray(n,t)}else{if(arraysEqual(n,s))return;mat3array.set(s),e.uniformMatrix3fv(this.addr,!1,mat3array),copyArray(n,s)}}function setValueM4(e,t){const n=this.cache,s=t.elements;if(s===0[0]){if(arraysEqual(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),copyArray(n,t)}else{if(arraysEqual(n,s))return;mat4array.set(s),e.uniformMatrix4fv(this.addr,!1,mat4array),copyArray(n,s)}}function setValueV1i(e,t){const n=this.cache;if(n[0]===t)return;e.uniform1i(this.addr,t),n[0]=t}function setValueV2i(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(arraysEqual(n,t))return;e.uniform2iv(this.addr,t),copyArray(n,t)}}function setValueV3i(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(arraysEqual(n,t))return;e.uniform3iv(this.addr,t),copyArray(n,t)}}function setValueV4i(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(arraysEqual(n,t))return;e.uniform4iv(this.addr,t),copyArray(n,t)}}function setValueV1ui(e,t){const n=this.cache;if(n[0]===t)return;e.uniform1ui(this.addr,t),n[0]=t}function setValueV2ui(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(arraysEqual(n,t))return;e.uniform2uiv(this.addr,t),copyArray(n,t)}}function setValueV3ui(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(arraysEqual(n,t))return;e.uniform3uiv(this.addr,t),copyArray(n,t)}}function setValueV4ui(e,t){const n=this.cache;if(t.x!==0[0])(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(arraysEqual(n,t))return;e.uniform4uiv(this.addr,t),copyArray(n,t)}}function initShadowTexture(e){return e.version===0&&(e.compareFunction=AlwaysCompare,e.needsUpdate=!0),e}function setValueT1(e,t,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let o;this.type===e.SAMPLER_2D_SHADOW?o=initShadowTexture(emptyShadowTexture):o=emptyTexture,n.setTexture2D(t||o,s)}function setValueT3D1(e,t,n){const o=this.cache,s=n.allocateTextureUnit();o[0]!==s&&(e.uniform1i(this.addr,s),o[0]=s),n.setTexture3D(t||empty3dTexture,s)}function setValueT6(e,t,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let o;this.type===e.SAMPLER_CUBE_SHADOW?o=initShadowTexture(emptyCubeShadowTexture):o=emptyCubeTexture,n.setTextureCube(t||o,s)}function setValueT2DArray1(e,t,n){const o=this.cache,s=n.allocateTextureUnit();o[0]!==s&&(e.uniform1i(this.addr,s),o[0]=s),n.setTexture2DArray(t||emptyArrayTexture,s)}function getSingularSetter(e){switch(e){case 5126:return setValueV1f;case 35664:return setValueV2f;case 35665:return setValueV3f;case 35666:return setValueV4f;case 35674:return setValueM2;case 35675:return setValueM3;case 35676:return setValueM4;case 5124:case 35670:return setValueV1i;case 35667:case 35671:return setValueV2i;case 35668:case 35672:return setValueV3i;case 35669:case 35673:return setValueV4i;case 5125:return setValueV1ui;case 36294:return setValueV2ui;case 36295:return setValueV3ui;case 36296:return setValueV4ui;case 35678:case 36198:case 36298:case 36306:case 35682:return setValueT1;case 35679:case 36299:case 36307:return setValueT3D1;case 35680:case 36300:case 36308:case 36293:return setValueT6;case 36289:case 36303:case 36311:case 36292:return setValueT2DArray1}}function setValueV1fArray(e,t){e.uniform1fv(this.addr,t)}function setValueV2fArray(e,t){const n=flatten(t,this.size,2);e.uniform2fv(this.addr,n)}function setValueV3fArray(e,t){const n=flatten(t,this.size,3);e.uniform3fv(this.addr,n)}function setValueV4fArray(e,t){const n=flatten(t,this.size,4);e.uniform4fv(this.addr,n)}function setValueM2Array(e,t){const n=flatten(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function setValueM3Array(e,t){const n=flatten(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function setValueM4Array(e,t){const n=flatten(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function setValueV1iArray(e,t){e.uniform1iv(this.addr,t)}function setValueV2iArray(e,t){e.uniform2iv(this.addr,t)}function setValueV3iArray(e,t){e.uniform3iv(this.addr,t)}function setValueV4iArray(e,t){e.uniform4iv(this.addr,t)}function setValueV1uiArray(e,t){e.uniform1uiv(this.addr,t)}function setValueV2uiArray(e,t){e.uniform2uiv(this.addr,t)}function setValueV3uiArray(e,t){e.uniform3uiv(this.addr,t)}function setValueV4uiArray(e,t){e.uniform4uiv(this.addr,t)}function setValueT1Array(e,t,n){const i=this.cache,a=t.length,s=allocTexUnits(n,a);arraysEqual(i,s)||(e.uniform1iv(this.addr,s),copyArray(i,s));let o;this.type===e.SAMPLER_2D_SHADOW?o=initShadowTexture(emptyShadowTexture):o=emptyTexture;for(let e=0;e!==a;++e)n.setTexture2D(t[e]||o,s[e])}function setValueT3DArray(e,t,n){const o=this.cache,i=t.length,s=allocTexUnits(n,i);arraysEqual(o,s)||(e.uniform1iv(this.addr,s),copyArray(o,s));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||empty3dTexture,s[e])}function setValueT6Array(e,t,n){const i=this.cache,a=t.length,s=allocTexUnits(n,a);arraysEqual(i,s)||(e.uniform1iv(this.addr,s),copyArray(i,s));let o;this.type===e.SAMPLER_CUBE_SHADOW?o=initShadowTexture(emptyCubeShadowTexture):o=emptyCubeTexture;for(let e=0;e!==a;++e)n.setTextureCube(t[e]||o,s[e])}function setValueT2DArrayArray(e,t,n){const o=this.cache,i=t.length,s=allocTexUnits(n,i);arraysEqual(o,s)||(e.uniform1iv(this.addr,s),copyArray(o,s));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||emptyArrayTexture,s[e])}function getPureArraySetter(e){switch(e){case 5126:return setValueV1fArray;case 35664:return setValueV2fArray;case 35665:return setValueV3fArray;case 35666:return setValueV4fArray;case 35674:return setValueM2Array;case 35675:return setValueM3Array;case 35676:return setValueM4Array;case 5124:case 35670:return setValueV1iArray;case 35667:case 35671:return setValueV2iArray;case 35668:case 35672:return setValueV3iArray;case 35669:case 35673:return setValueV4iArray;case 5125:return setValueV1uiArray;case 36294:return setValueV2uiArray;case 36295:return setValueV3uiArray;case 36296:return setValueV4uiArray;case 35678:case 36198:case 36298:case 36306:case 35682:return setValueT1Array;case 35679:case 36299:case 36307:return setValueT3DArray;case 35680:case 36300:case 36308:case 36293:return setValueT6Array;case 36289:case 36303:case 36311:case 36292:return setValueT2DArrayArray}}class SingleUniform{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=getSingularSetter(t.type)}}class PureArrayUniform{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=getPureArraySetter(t.type)}}class StructuredUniform{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const i=s[o];i.setValue(e,t[i.id],n)}}}const RePathPart=/(\w+)(\])?(\[|\.)?/g;function addUniform(e,t){e.seq.push(t),e.map[t.id]=t}function parseUniform(e,t,n){const s=e.name,o=s.length;for(RePathPart.lastIndex=0;!0;){const r=RePathPart.exec(s),l=RePathPart.lastIndex;let i=r[1];const d=r[2]==="]",c=r[3];if(d&&(i=i|0),c===0[0]||c==="["&&l+2===o){addUniform(n,c===0[0]?new SingleUniform(i,e,t):new PureArrayUniform(i,e,t));break}const u=n.map;let a=u[i];a===0[0]&&(a=new StructuredUniform(i),addUniform(n,a)),n=a}}class WebGLUniforms{constructor(e,t){this.seq=[],this.map={};const o=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<o;++n){const s=e.getActiveUniform(t,n),i=e.getUniformLocation(t,s.name);parseUniform(s,i,this)}const n=[],s=[];for(const t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?n.push(t):s.push(t);n.length>0&&(this.seq=n.concat(s))}setValue(e,t,n,s){const o=this.map[t];o!==0[0]&&o.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==0[0]&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let o=0,r=t.length;o!==r;++o){const i=t[o],a=n[i.id];a.needsUpdate!==!1&&i.setValue(e,a.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,i=e.length;s!==i;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function WebGLShader(e,t,n){const s=e.createShader(t);return e.shaderSource(s,n),e.compileShader(s),s}const COMPLETION_STATUS_KHR=37297;let programIdCount=0;function handleSource(e,t){const n=e.split(`
`),s=[],o=Math.max(t-6,0),i=Math.min(t+6,n.length);for(let e=o;e<i;e++){const a=e+1;s.push(`${a===t?">":" "} ${a}: ${n[e]}`)}return s.join(`
`)}const _m0=new Matrix3;function getEncodingComponents(e){ColorManagement._getMatrix(_m0,ColorManagement.workingColorSpace,e);const t=`mat3( ${_m0.elements.map(e=>e.toFixed(4))} )`;switch(ColorManagement.getTransfer(e)){case LinearTransfer:return[t,"LinearTransferOETF"];case SRGBTransfer:return[t,"sRGBTransferOETF"];default:return warn("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function getShaderErrors(e,t,n){const i=e.getShaderParameter(t,e.COMPILE_STATUS),a=e.getShaderInfoLog(t)||"",s=a.trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const i=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+handleSource(e.getShaderSource(t),i)}return s}function getTexelEncodingFunction(e,t){const n=getEncodingComponents(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const toneMappingFunctions={[LinearToneMapping]:"Linear",[ReinhardToneMapping]:"Reinhard",[CineonToneMapping]:"Cineon",[ACESFilmicToneMapping]:"ACESFilmic",[AgXToneMapping]:"AgX",[NeutralToneMapping]:"Neutral",[CustomToneMapping]:"Custom"};function getToneMappingFunction(e,t){const n=toneMappingFunctions[t];return n===0[0]?(warn("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const _v0=new Vector3;function getLuminanceFunction(){ColorManagement.getLuminanceCoefficients(_v0);const e=_v0.x.toFixed(4),t=_v0.y.toFixed(4),n=_v0.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function generateVertexExtensions(e){const t=[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""];return t.filter(filterEmptyLine).join(`
`)}function generateDefines(e){const t=[];for(const n in e){const s=e[n];if(s===!1)continue;t.push("#define "+n+" "+s)}return t.join(`
`)}function fetchAttributeLocations(e,t){const n={},s=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let a=0;a<s;a++){const o=e.getActiveAttrib(t,a),r=o.name;let i=1;o.type===e.FLOAT_MAT2&&(i=2),o.type===e.FLOAT_MAT3&&(i=3),o.type===e.FLOAT_MAT4&&(i=4),n[r]={type:o.type,location:e.getAttribLocation(t,r),locationSize:i}}return n}function filterEmptyLine(e){return e!==""}function replaceLightNums(e,t){const n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function replaceClippingPlaneNums(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const includePattern=/^[ \t]*#include +<([\w\d./]+)>/gm;function resolveIncludes(e){return e.replace(includePattern,includeReplacer)}function includeReplacer(e,t){const n=ShaderChunk[t];if(n===0[0])throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return resolveIncludes(n)}const unrollLoopPattern=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function unrollLoops(e){return e.replace(unrollLoopPattern,loopReplacer)}function loopReplacer(e,t,n,s){let o="";for(let e=parseInt(t);e<parseInt(n);e++)o+=s.replace(/\[\s*i\s*\]/g,"[ "+e+" ]").replace(/UNROLLED_LOOP_INDEX/g,e);return o}function generatePrecision(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const shadowMapTypeDefines={[PCFShadowMap]:"SHADOWMAP_TYPE_PCF",[VSMShadowMap]:"SHADOWMAP_TYPE_VSM"};function generateShadowMapTypeDefine(e){return shadowMapTypeDefines[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const envMapModeDefines={[CubeRefractionMapping]:"ENVMAP_MODE_REFRACTION"};function generateEnvMapModeDefine(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":envMapModeDefines[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}const envMapBlendingDefines={[MultiplyOperation]:"ENVMAP_BLENDING_MULTIPLY",[MixOperation]:"ENVMAP_BLENDING_MIX",[AddOperation]:"ENVMAP_BLENDING_ADD"};function generateEnvMapBlendingDefine(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":envMapBlendingDefines[e.combine]||"ENVMAP_BLENDING_NONE"}function WebGLProgram(e,t,n,s){const o=e.getContext(),C=n.defines;let a=n.vertexShader,r=n.fragmentShader;const b=generateShadowMapTypeDefine(n),y=n.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",v=generateEnvMapModeDefine(n),x=generateEnvMapBlendingDefine(n),O=generateVertexExtensions(n),h=generateDefines(C),i=o.createProgram();let l,c,p=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(l=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,h].filter(filterEmptyLine).join(`
`),l.length>0&&(l+=`
`),c=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,h].filter(filterEmptyLine).join(`
`),c.length>0&&(c+=`
`)):(l=[generatePrecision(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,h,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+v:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+n.diffuseRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+b:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(filterEmptyLine).join(`
`),c=[generatePrecision(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,h,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+y:"",n.envMap?"#define "+v:"",n.envMap?"#define "+x:"",n.envMapPMREM?"#define ENVMAP_MAX_LOD "+n.envMapMaxLod+".0":"",n.envMapPMREM?"#define ENVMAP_SIZE "+n.envMapSize+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",n.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+b:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==NoToneMapping?"#define TONE_MAPPING":"",n.toneMapping!==NoToneMapping?ShaderChunk.tonemapping_pars_fragment:"",n.toneMapping!==NoToneMapping?getToneMappingFunction("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ShaderChunk.colorspace_pars_fragment,getTexelEncodingFunction("linearToOutputTexel",n.outputColorSpace),getLuminanceFunction(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(filterEmptyLine).join(`
`)),a=resolveIncludes(a),a=replaceLightNums(a,n),a=replaceClippingPlaneNums(a,n),r=resolveIncludes(r),r=replaceLightNums(r,n),r=replaceClippingPlaneNums(r,n),a=unrollLoops(a),r=unrollLoops(r),n.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,l=[O,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+l,c=["#define varying in",n.glslVersion===GLSL3?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===GLSL3?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+c);const w=p+l+a,_=p+c+r,u=WebGLShader(o,o.VERTEX_SHADER,w),d=WebGLShader(o,o.FRAGMENT_SHADER,_);o.attachShader(i,u),o.attachShader(i,d),n.index0AttributeName!==0[0]?o.bindAttribLocation(i,0,n.index0AttributeName):n.hasPositionAttribute===!0&&o.bindAttribLocation(i,0,"position"),o.linkProgram(i);function j(t){if(e.debug.checkShaderErrors){const m=o.getProgramInfoLog(i)||"",f=o.getShaderInfoLog(u)||"",p=o.getShaderInfoLog(d)||"",n=m.trim(),s=f.trim(),a=p.trim();let r=!0,h=!0;if(o.getProgramParameter(i,o.LINK_STATUS)===!1)if(r=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(o,i,u,d);else{const e=getShaderErrors(o,u,"vertex"),s=getShaderErrors(o,d,"fragment");error("WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(i,o.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+n+`
`+e+`
`+s)}else n!==""?warn("WebGLProgram: Program Info Log:",n):(s===""||a==="")&&(h=!1);h&&(t.diagnostics={runnable:r,programLog:n,vertexShader:{log:s,prefix:l},fragmentShader:{log:a,prefix:c}})}o.deleteShader(u),o.deleteShader(d),m=new WebGLUniforms(o,i),f=fetchAttributeLocations(o,i)}let m;this.getUniforms=function(){return m===0[0]&&j(this),m};let f;this.getAttributes=function(){return f===0[0]&&j(this),f};let g=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return g===!1&&(g=o.getProgramParameter(i,COMPLETION_STATUS_KHR)),g},this.destroy=function(){s.releaseStatesOfProgram(this),o.deleteProgram(i),this.program=0[0]},this.type=n.shaderType,this.name=n.shaderName,this.id=programIdCount++,this.cacheKey=t,this.usedTimes=1,this.program=i,this.vertexShader=u,this.fragmentShader=d,this}let _id=0;class WebGLShaderCache{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let t=n.get(e);return t===0[0]&&(t=new Set,n.set(e,t)),t}_getShaderStage(e){const n=this.shaderCache;let t=n.get(e);return t===0[0]&&(t=new WebGLShaderStage(e),n.set(e,t)),t}}class WebGLShaderStage{constructor(e){this.id=_id++,this.code=e,this.usedTimes=0}}function isPackedRGFormat(e){return e===RGFormat||e===RG11_EAC_Format||e===RED_GREEN_RGTC2_Format}function WebGLPrograms(e,t,n,s,o,i){const a=new Layers,l=new WebGLShaderCache,d=new Set,c=[],u=new Map,f=s.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function r(e){return d.add(e),e===0?"uv":`uv${e}`}function m(o,a,c,u,m,p){const N=u.fog,g=m.geometry,_e=o.isMeshStandardMaterial||o.isMeshLambertMaterial||o.isMeshPhongMaterial?u.environment:null,je=o.isMeshStandardMaterial||o.isMeshLambertMaterial&&!o.envMap||o.isMeshPhongMaterial&&!o.envMap,b=t.get(o.envMap||_e,je),P=h[o.type];let w=s.precision;o.precision!==null&&(w=s.getMaxPrecision(o.precision),w!==o.precision&&warn("WebGLProgram.getParameters:",o.precision,"not supported, using",w,"instead."));const $=g.morphAttributes.position||g.morphAttributes.normal||g.morphAttributes.color,me=$!==0[0]?$.length:0;let C=0;g.morphAttributes.position!==0[0]&&(C=1),g.morphAttributes.normal!==0[0]&&(C=2),g.morphAttributes.color!==0[0]&&(C=3);let M,k,X,J;if(P){const e=ShaderLib[P];M=e.vertexShader,k=e.fragmentShader}else{M=o.vertexShader,k=o.fragmentShader;const e=l.getVertexShaderStage(o),t=l.getFragmentShaderStage(o);l.update(o,e,t),X=e.id,J=t.id}const j=e.getRenderTarget(),he=e.state.buffers.depth.getReversed(),T=m.isInstancedMesh===!0,z=m.isBatchedMesh===!0,x=!!o.map,ye=!!o.matcap,L=!!b,O=L&&b.isPMREMTexture===!0,B=!!o.aoMap,H=!!o.lightMap,Q=!!o.bumpMap&&o.wireframe===!1,v=!!o.normalMap,V=!!o.displacementMap,R=!!o.emissiveMap,W=!!o.metalnessMap,U=!!o.roughnessMap,E=o.anisotropy>0,_=o.clearcoat>0,Y=o.diffuseRoughness>0,be=o.dispersion>0,pe=o.retroreflectivity>0,D=o.iridescence>0,F=o.sheen>0,S=o.transmission>0,ee=E&&!!o.anisotropyMap,te=_&&!!o.clearcoatMap,ne=_&&!!o.clearcoatNormalMap,se=_&&!!o.clearcoatRoughnessMap,oe=Y&&!!o.diffuseRoughnessMap,ie=D&&!!o.iridescenceMap,ae=D&&!!o.iridescenceThicknessMap,re=F&&!!o.sheenColorMap,ce=F&&!!o.sheenRoughnessMap,le=!!o.specularMap,de=!!o.specularColorMap,ue=!!o.specularIntensityMap,Z=S&&!!o.transmissionMap,I=S&&!!o.thicknessMap,fe=!!o.gradientMap,A=!!o.alphaMap,ge=o.alphaTest>0,ve=!!o.alphaHash,G=!!o.extensions;let q=NoToneMapping;o.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(q=e.toneMapping);const K=O?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,y={shaderID:P,shaderType:o.type,shaderName:o.name,vertexShader:M,fragmentShader:k,defines:o.defines,customVertexShaderID:X,customFragmentShaderID:J,isRawShaderMaterial:o.isRawShaderMaterial===!0,glslVersion:o.glslVersion,precision:w,batching:z,batchingColor:z&&m._colorsTexture!==null,instancing:T,instancingColor:T&&m.instanceColor!==null,instancingMorph:T&&m.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:ColorManagement.workingColorSpace,alphaToCoverage:!!o.alphaToCoverage,map:x,matcap:ye,envMap:L,envMapMode:L&&b.mapping,envMapPMREM:O,envMapMaxLod:O?K.length-1:null,envMapSize:O?K[0].width:null,aoMap:B,lightMap:H,bumpMap:Q,normalMap:v,displacementMap:V,emissiveMap:R,normalMapObjectSpace:v&&o.normalMapType===ObjectSpaceNormalMap,normalMapTangentSpace:v&&o.normalMapType===TangentSpaceNormalMap,packedNormalMap:v&&o.normalMapType===TangentSpaceNormalMap&&isPackedRGFormat(o.normalMap.format),metalnessMap:W,roughnessMap:U,anisotropy:E,anisotropyMap:ee,clearcoat:_,clearcoatMap:te,clearcoatNormalMap:ne,clearcoatRoughnessMap:se,diffuseRoughness:Y,diffuseRoughnessMap:oe,dispersion:be,retroreflection:pe,iridescence:D,iridescenceMap:ie,iridescenceThicknessMap:ae,sheen:F,sheenColorMap:re,sheenRoughnessMap:ce,specularMap:le,specularColorMap:de,specularIntensityMap:ue,transmission:S,transmissionMap:Z,thicknessMap:I,gradientMap:fe,opaque:o.transparent===!1&&o.blending===NormalBlending&&o.alphaToCoverage===!1,alphaMap:A,alphaTest:ge,alphaHash:ve,combine:o.combine,mapUv:x&&r(o.map.channel),aoMapUv:B&&r(o.aoMap.channel),lightMapUv:H&&r(o.lightMap.channel),bumpMapUv:Q&&r(o.bumpMap.channel),normalMapUv:v&&r(o.normalMap.channel),displacementMapUv:V&&r(o.displacementMap.channel),emissiveMapUv:R&&r(o.emissiveMap.channel),metalnessMapUv:W&&r(o.metalnessMap.channel),roughnessMapUv:U&&r(o.roughnessMap.channel),anisotropyMapUv:ee&&r(o.anisotropyMap.channel),clearcoatMapUv:te&&r(o.clearcoatMap.channel),clearcoatNormalMapUv:ne&&r(o.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&r(o.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:oe&&r(o.diffuseRoughnessMap.channel),iridescenceMapUv:ie&&r(o.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&r(o.iridescenceThicknessMap.channel),sheenColorMapUv:re&&r(o.sheenColorMap.channel),sheenRoughnessMapUv:ce&&r(o.sheenRoughnessMap.channel),specularMapUv:le&&r(o.specularMap.channel),specularColorMapUv:de&&r(o.specularColorMap.channel),specularIntensityMapUv:ue&&r(o.specularIntensityMap.channel),transmissionMapUv:Z&&r(o.transmissionMap.channel),thicknessMapUv:I&&r(o.thicknessMap.channel),alphaMapUv:A&&r(o.alphaMap.channel),vertexTangents:!!g.attributes.tangent&&(v||E),vertexNormals:!!g.attributes.normal,vertexColors:o.vertexColors,vertexAlphas:o.vertexColors===!0&&!!g.attributes.color&&g.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!g.attributes.uv&&(x||A),fog:!!N,useFog:o.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:o.wireframe===!1&&(o.flatShading===!0||g.attributes.normal===0[0]&&v===!1&&(o.isMeshLambertMaterial||o.isMeshPhongMaterial||o.isMeshStandardMaterial||o.isMeshPhysicalMaterial)),sizeAttenuation:o.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:he,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:g.attributes.position!==0[0],morphTargets:g.morphAttributes.position!==0[0],morphNormals:g.morphAttributes.normal!==0[0],morphColors:g.morphAttributes.color!==0[0],morphTargetsCount:me,morphTextureStride:C,numSunLights:a.sun.length,numDirLights:a.directional.length,numPointLights:a.point.length,numSpotLights:a.spot.length,numSpotLightMaps:a.spotLightMap.length,numRectAreaLights:a.rectArea.length,numHemiLights:a.hemi.length,numSunLightShadows:a.sunShadowMap.length,numDirLightShadows:a.directionalShadowMap.length,numPointLightShadows:a.pointShadowMap.length,numSpotLightShadows:a.spotShadowMap.length,numSpotLightShadowsWithMaps:a.numSpotLightShadowsWithMaps,numLightProbes:a.numLightProbes,numLightProbeGrids:p.filter(e=>e.texture!==null).length,numClippingPlanes:i.numPlanes,numClipIntersection:i.numIntersection,dithering:o.dithering,shadowMapEnabled:e.shadowMap.enabled&&c.length>0,shadowMapType:e.shadowMap.type,toneMapping:q,decodeVideoTexture:x&&o.map.isVideoTexture===!0&&ColorManagement.getTransfer(o.map.colorSpace)===SRGBTransfer,decodeVideoTextureEmissive:R&&o.emissiveMap.isVideoTexture===!0&&ColorManagement.getTransfer(o.emissiveMap.colorSpace)===SRGBTransfer,premultipliedAlpha:o.premultipliedAlpha,doubleSided:o.side===DoubleSide,flipSided:o.side===BackSide,useDepthPacking:o.depthPacking>=0,depthPacking:o.depthPacking||0,index0AttributeName:o.index0AttributeName,extensionClipCullDistance:G&&o.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(G&&o.extensions.multiDraw===!0||z)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:o.customProgramCacheKey()};return y.vertexUv1s=d.has(1),y.vertexUv2s=d.has(2),y.vertexUv3s=d.has(3),d.clear(),y}function p(t){const n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==0[0])for(const e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){a.disableAll(),t.instancing&&a.enable(0),t.instancingColor&&a.enable(1),t.instancingMorph&&a.enable(2),t.matcap&&a.enable(3),t.envMap&&a.enable(4),t.normalMapObjectSpace&&a.enable(5),t.normalMapTangentSpace&&a.enable(6),t.clearcoat&&a.enable(7),t.iridescence&&a.enable(8),t.alphaTest&&a.enable(9),t.vertexColors&&a.enable(10),t.vertexAlphas&&a.enable(11),t.vertexUv1s&&a.enable(12),t.vertexUv2s&&a.enable(13),t.vertexUv3s&&a.enable(14),t.vertexTangents&&a.enable(15),t.anisotropy&&a.enable(16),t.alphaHash&&a.enable(17),t.batching&&a.enable(18),t.dispersion&&a.enable(19),t.retroreflection&&a.enable(24),t.diffuseRoughness&&a.enable(25),t.batchingColor&&a.enable(20),t.gradientMap&&a.enable(21),t.packedNormalMap&&a.enable(22),t.vertexNormals&&a.enable(23),e.push(a.mask),a.disableAll(),t.fog&&a.enable(0),t.useFog&&a.enable(1),t.flatShading&&a.enable(2),t.logarithmicDepthBuffer&&a.enable(3),t.reversedDepthBuffer&&a.enable(4),t.skinning&&a.enable(5),t.morphTargets&&a.enable(6),t.morphNormals&&a.enable(7),t.morphColors&&a.enable(8),t.premultipliedAlpha&&a.enable(9),t.shadowMapEnabled&&a.enable(10),t.doubleSided&&a.enable(11),t.flipSided&&a.enable(12),t.useDepthPacking&&a.enable(13),t.dithering&&a.enable(14),t.transmission&&a.enable(15),t.sheen&&a.enable(16),t.opaque&&a.enable(17),t.pointsUvs&&a.enable(18),t.decodeVideoTexture&&a.enable(19),t.decodeVideoTextureEmissive&&a.enable(20),t.alphaToCoverage&&a.enable(21),t.numLightProbeGrids>0&&a.enable(22),t.hasPositionAttribute&&a.enable(23),e.push(a.mask)}function b(e){const n=h[e.type];let t;if(n){const e=ShaderLib[n];t=UniformsUtils.clone(e.uniforms)}else t=e.uniforms;return t}function j(t,n){let s=u.get(n);return s!==0[0]?++s.usedTimes:(s=new WebGLProgram(e,n,t,o),c.push(s),u.set(n,s)),s}function y(e){if(--e.usedTimes===0){const t=c.indexOf(e);c[t]=c[c.length-1],c.pop(),u.delete(e.cacheKey),e.destroy()}}function _(e){l.remove(e)}function w(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:b,acquireProgram:j,releaseProgram:y,releaseShaderCache:_,programs:c,dispose:w}}function WebGLProperties(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===0[0]&&(n={},e.set(t,n)),n}function s(t){e.delete(t)}function o(t,n,s){e.get(t)[n]=s}function i(){e=new WeakMap}return{has:t,get:n,remove:s,update:o,dispose:i}}function painterSortStable(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function reversePainterSortStable(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function WebGLRenderList(){const o=[];let s=0;const e=[],t=[],n=[];function r(){s=0,e.length=0,t.length=0,n.length=0}function i(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function a(e,t,n,a,r,c){let l=o[s];return l===0[0]?(l={id:e.id,object:e,geometry:t,material:n,materialVariant:i(e),groupOrder:a,renderOrder:e.renderOrder,z:r,group:c},o[s]=l):(l.id=e.id,l.object=e,l.geometry=t,l.material=n,l.materialVariant=i(e),l.groupOrder=a,l.renderOrder=e.renderOrder,l.z=r,l.group=c),s++,l}function c(s,o,i,r,c,l,d){d.reversedDepth===!0&&(c=-c);const u=a(s,o,i,r,c,l);i.transmission>0?t.push(u):i.transparent===!0?n.push(u):e.push(u)}function l(s,o,i,r,c,l){const d=a(s,o,i,r,c,l);i.transmission>0?t.unshift(d):i.transparent===!0?n.unshift(d):e.unshift(d)}function d(s,o){e.length>1&&e.sort(s||painterSortStable),t.length>1&&t.sort(o||reversePainterSortStable),n.length>1&&n.sort(o||reversePainterSortStable)}function u(){for(let t=s,n=o.length;t<n;t++){const e=o[t];if(e.id===null)break;e.id=null,e.object=null,e.geometry=null,e.material=null,e.group=null}}return{opaque:e,transmissive:t,transparent:n,init:r,push:c,unshift:l,finish:u,sort:d}}function WebGLRenderLists(){let e=new WeakMap;function t(t,n){const o=e.get(t);let s;return o===0[0]?(s=new WebGLRenderList,e.set(t,[s])):n>=o.length?(s=new WebGLRenderList,o.push(s)):s=o[n],s}function n(){e=new WeakMap}return{get:t,dispose:n}}function UniformsCache(){const e={};return{get:function(t){if(e[t.id]!==0[0])return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new Vector3,color:new Color};break;case"SpotLight":n={position:new Vector3,direction:new Vector3,color:new Color,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new Vector3,color:new Color,distance:0,decay:0};break;case"HemisphereLight":n={direction:new Vector3,skyColor:new Color,groundColor:new Color};break;case"RectAreaLight":n={color:new Color,position:new Vector3,halfWidth:new Vector3,halfHeight:new Vector3};break}return e[t.id]=n,n}}}function ShadowUniformsCache(){const e={};return{get:function(t){if(e[t.id]!==0[0])return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}let nextVersion=0;function shadowCastingAndTexturingLightsFirst(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function WebGLLights(e){const n=new UniformsCache,s=ShadowUniformsCache(),t={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)t.probe.push(new Vector3);const o=new Vector3,a=new Matrix4,i=new Matrix4;function r(o){let y=0,w=0,_=0;for(let e=0;e<9;e++)t.probe[e].set(0,0,0);let p=0,l=0,v=0,a=0,c=0,r=0,u=0,g=0,h=0,m=0,f=0,d=0,j=0,b=0;o.sort(shadowCastingAndTexturingLightsFirst);for(let C=0,E=o.length;C<E;C++){const e=o[C],x=e.color,i=e.intensity,k=e.distance;let O=null;if(e.shadow&&e.shadow.map&&(e.shadow.map.texture.format===RGFormat?O=e.shadow.map.texture:O=e.shadow.map.depthTexture||e.shadow.map.texture),e.isAmbientLight)y+=x.r*i,w+=x.g*i,_+=x.b*i;else if(e.isLightProbe){for(let n=0;n<9;n++)t.probe[n].addScaledVector(e.sh.coefficients[n],i);b++}else if(e.isSunLight){const o=n.get(e);if(o.color.copy(e.color).multiplyScalar(e.intensity),e.castShadow){const n=e.shadow,o=s.get(e);o.shadowIntensity=n.intensity,o.shadowBias=n.bias,o.shadowNormalBias=n.normalBias,o.shadowRadius=n.radius,o.shadowMapSize.copy(n.mapSize).multiply(n.getFrameExtents()),t.sunShadow[l]=o,t.sunShadowMap[l]=O;const i=n.getViewportCount();for(let e=0;e<i;e++)t.sunShadowMatrix[v+e]=n.getMatrix(e),t.sunShadowCascade[v+e]=n._cascadeData[e];v+=i,l++}t.sun[p]=o,p++}else if(e.isDirectionalLight){const o=n.get(e);if(o.color.copy(e.color).multiplyScalar(e.intensity),e.castShadow){const o=e.shadow,n=s.get(e);n.shadowIntensity=o.intensity,n.shadowBias=o.bias,n.shadowNormalBias=o.normalBias,n.shadowRadius=o.radius,n.shadowMapSize=o.mapSize,t.directionalShadow[a]=n,t.directionalShadowMap[a]=O,t.directionalShadowMatrix[a]=e.shadow.matrix,h++}t.directional[a]=o,a++}else if(e.isSpotLight){const o=n.get(e);o.position.setFromMatrixPosition(e.matrixWorld),o.color.copy(x).multiplyScalar(i),o.distance=k,o.coneCos=Math.cos(e.angle),o.penumbraCos=Math.cos(e.angle*(1-e.penumbra)),o.decay=e.decay,t.spot[r]=o;const a=e.shadow;if(e.map&&(t.spotLightMap[d]=e.map,d++,a.updateMatrices(e),e.castShadow&&j++),t.spotLightMatrix[r]=a.matrix,e.castShadow){const n=s.get(e);n.shadowIntensity=a.intensity,n.shadowBias=a.bias,n.shadowNormalBias=a.normalBias,n.shadowRadius=a.radius,n.shadowMapSize=a.mapSize,t.spotShadow[r]=n,t.spotShadowMap[r]=O,f++}r++}else if(e.isRectAreaLight){const s=n.get(e);s.color.copy(x).multiplyScalar(i),s.halfWidth.set(e.width*.5,0,0),s.halfHeight.set(0,e.height*.5,0),t.rectArea[u]=s,u++}else if(e.isPointLight){const o=n.get(e);if(o.color.copy(e.color).multiplyScalar(e.intensity),o.distance=e.distance,o.decay=e.decay,e.castShadow){const o=e.shadow,n=s.get(e);n.shadowIntensity=o.intensity,n.shadowBias=o.bias,n.shadowNormalBias=o.normalBias,n.shadowRadius=o.radius,n.shadowMapSize=o.mapSize,n.shadowCameraNear=o.camera.near,n.shadowCameraFar=o.camera.far,t.pointShadow[c]=n,t.pointShadowMap[c]=O,t.pointShadowMatrix[c]=e.shadow.matrix,m++}t.point[c]=o,c++}else if(e.isHemisphereLight){const s=n.get(e);s.skyColor.copy(e.color).multiplyScalar(i),s.groundColor.copy(e.groundColor).multiplyScalar(i),t.hemi[g]=s,g++}}u>0&&(e.has("OES_texture_float_linear")===!0?(t.rectAreaLTC1=UniformsLib.LTC_FLOAT_1,t.rectAreaLTC2=UniformsLib.LTC_FLOAT_2):(t.rectAreaLTC1=UniformsLib.LTC_HALF_1,t.rectAreaLTC2=UniformsLib.LTC_HALF_2)),t.ambient[0]=y,t.ambient[1]=w,t.ambient[2]=_;const i=t.hash;(i.sunLength!==p||i.directionalLength!==a||i.pointLength!==c||i.spotLength!==r||i.rectAreaLength!==u||i.hemiLength!==g||i.numSunShadows!==l||i.numDirectionalShadows!==h||i.numPointShadows!==m||i.numSpotShadows!==f||i.numSpotMaps!==d||i.numLightProbes!==b)&&(t.sun.length=p,t.directional.length=a,t.spot.length=r,t.rectArea.length=u,t.point.length=c,t.hemi.length=g,t.sunShadow.length=l,t.sunShadowMap.length=l,t.sunShadowMatrix.length=v,t.sunShadowCascade.length=v,t.directionalShadow.length=h,t.directionalShadowMap.length=h,t.directionalShadowMatrix.length=h,t.pointShadow.length=m,t.pointShadowMap.length=m,t.pointShadowMatrix.length=m,t.spotShadow.length=f,t.spotShadowMap.length=f,t.spotLightMatrix.length=f+d-j,t.spotLightMap.length=d,t.numSpotLightShadowsWithMaps=j,t.numLightProbes=b,i.sunLength=p,i.directionalLength=a,i.pointLength=c,i.spotLength=r,i.rectAreaLength=u,i.hemiLength=g,i.numSunShadows=l,i.numDirectionalShadows=h,i.numPointShadows=m,i.numSpotShadows=f,i.numSpotMaps=d,i.numLightProbes=b,t.version=nextVersion++)}function c(e,n){let r=0,c=0,l=0,d=0,u=0,h=0;const s=n.matrixWorldInverse;for(let m=0,f=e.length;m<f;m++){const n=e[m];if(n.isSunLight){const e=t.sun[r];e.direction.setFromMatrixPosition(n.matrixWorld),e.direction.transformDirection(s),r++}else if(n.isDirectionalLight){const e=t.directional[c];e.direction.setFromMatrixPosition(n.matrixWorld),o.setFromMatrixPosition(n.target.matrixWorld),e.direction.sub(o),e.direction.transformDirection(s),c++}else if(n.isSpotLight){const e=t.spot[d];e.position.setFromMatrixPosition(n.matrixWorld),e.position.applyMatrix4(s),e.direction.setFromMatrixPosition(n.matrixWorld),o.setFromMatrixPosition(n.target.matrixWorld),e.direction.sub(o),e.direction.transformDirection(s),d++}else if(n.isRectAreaLight){const e=t.rectArea[u];e.position.setFromMatrixPosition(n.matrixWorld),e.position.applyMatrix4(s),i.identity(),a.copy(n.matrixWorld),a.premultiply(s),i.extractRotation(a),e.halfWidth.set(n.width*.5,0,0),e.halfHeight.set(0,n.height*.5,0),e.halfWidth.applyMatrix4(i),e.halfHeight.applyMatrix4(i),u++}else if(n.isPointLight){const e=t.point[l];e.position.setFromMatrixPosition(n.matrixWorld),e.position.applyMatrix4(s),l++}else if(n.isHemisphereLight){const e=t.hemi[h];e.direction.setFromMatrixPosition(n.matrixWorld),e.direction.transformDirection(s),h++}}}return{setup:r,setupView:c,state:t}}function WebGLRenderState(e){const s=new WebGLLights(e),t=[],o=[],n=[];function a(e){i.camera=e,t.length=0,o.length=0,n.length=0}function r(e){e.isLightProbeGrid?n.push(e):t.push(e)}function c(e){o.push(e)}function l(){s.setup(t),n.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function d(e){s.setupView(t,e)}const i={lightsArray:t,shadowsArray:o,lightProbeGridArray:n,camera:null,lights:s,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:i,setupLights:l,setupLightsView:d,pushLight:r,pushShadow:c}}function WebGLRenderStates(e){let t=new WeakMap;function n(n,s=0){const i=t.get(n);let o;return i===0[0]?(o=new WebGLRenderState(e),t.set(n,[o])):s>=i.length?(o=new WebGLRenderState(e),i.push(o)):o=i[s],o}function s(){t=new WeakMap}return{get:n,dispose:s}}const vertex=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragment=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,_cubeDirections=[new Vector3(1,0,0),new Vector3(-1,0,0),new Vector3(0,1,0),new Vector3(0,-1,0),new Vector3(0,0,1),new Vector3(0,0,-1)],_cubeUps=[new Vector3(0,-1,0),new Vector3(0,-1,0),new Vector3(0,0,1),new Vector3(0,0,-1),new Vector3(0,-1,0),new Vector3(0,-1,0)],_projScreenMatrix=new Matrix4,_lightPositionWorld=new Vector3,_lookTarget=new Vector3;function WebGLShadowMap(e,t,n){let f=new Frustum;const s=new Vector2,o=new Vector2,p=new Vector4,b=new MeshDepthMaterial,_=new MeshDistanceMaterial,c={},r=n.maxTextureSize,y={[FrontSide]:BackSide,[BackSide]:FrontSide,[DoubleSide]:DoubleSide},i=new ShaderMaterial({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vector2},radius:{value:4}},vertexShader:vertex,fragmentShader:fragment}),a=i.clone();a.defines.HORIZONTAL_PASS=1;const g=new BufferGeometry;g.setAttribute("position",new BufferAttribute(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const d=new Mesh(g,i),l=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=PCFShadowMap;let v=this.type;this.render=function(t,n,i){if(l.enabled===!1)return;if(l.autoUpdate===!1&&l.needsUpdate===!1)return;if(t.length===0)return;this.type===PCFSoftShadowMap&&(warn("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=PCFShadowMap);const d=e.getRenderTarget(),u=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),a=e.state;a.setBlending(NoBlending),a.buffers.depth.getReversed()===!0?a.buffers.color.setClear(0,0,0,0):a.buffers.color.setClear(1,1,1,1),a.buffers.depth.setTest(!0),a.setScissorTest(!1);const c=v!==this.type;c&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let h=0,v=t.length;h<v;h++){const d=t[h],l=d.shadow;if(l===0[0]){warn("WebGLShadowMap:",d,"has no shadow.");continue}if(l.autoUpdate===!1&&l.needsUpdate===!1)continue;s.copy(l.mapSize);const u=l.getFrameExtents();s.multiply(u),o.copy(l.mapSize),(s.x>r||s.y>r)&&(s.x>r&&(o.x=Math.floor(r/u.x),s.x=o.x*u.x,l.mapSize.x=o.x),s.y>r&&(o.y=Math.floor(r/u.y),s.y=o.y*u.y,l.mapSize.y=o.y));const g=e.state.buffers.depth.getReversed();if(l.camera._reversedDepth=g,l.map===null||c===!0){if(l.map!==null&&(l.map.depthTexture!==null&&(l.map.depthTexture.dispose(),l.map.depthTexture=null),l.map.dispose()),this.type===VSMShadowMap){if(d.isPointLight){warn("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}l.map=new WebGLRenderTarget(s.x,s.y,{format:RGFormat,type:HalfFloatType,minFilter:LinearFilter,magFilter:LinearFilter,generateMipmaps:!1}),l.map.texture.name=d.name+".shadowMap",l.map.depthTexture=new DepthTexture(s.x,s.y,FloatType),l.map.depthTexture.name=d.name+".shadowMapDepth",l.map.depthTexture.format=DepthFormat,l.map.depthTexture.compareFunction=null,l.map.depthTexture.minFilter=NearestFilter,l.map.depthTexture.magFilter=NearestFilter}else d.isPointLight?(l.map=new WebGLCubeRenderTarget(s.x),l.map.depthTexture=new CubeDepthTexture(s.x,UnsignedIntType)):(l.map=new WebGLRenderTarget(s.x,s.y),l.map.depthTexture=new DepthTexture(s.x,s.y,UnsignedIntType)),l.map.depthTexture.name=d.name+".shadowMap",l.map.depthTexture.format=DepthFormat,this.type===PCFShadowMap?(l.map.depthTexture.compareFunction=g?GreaterEqualCompare:LessEqualCompare,l.map.depthTexture.minFilter=LinearFilter,l.map.depthTexture.magFilter=LinearFilter):(l.map.depthTexture.compareFunction=null,l.map.depthTexture.minFilter=NearestFilter,l.map.depthTexture.magFilter=NearestFilter);l.camera.updateProjectionMatrix()}l.map.isWebGLCubeRenderTarget!==!0&&(l.map.width!==s.x||l.map.height!==s.y)&&l.map.setSize(s.x,s.y);const b=l.map.isWebGLCubeRenderTarget?6:l.getViewportCount();d.isPointLight!==!0&&l.updateMatrices(d,i);const y=(l.camera.layers.mask&4294967294)!==0?l.camera.layers:i.layers;for(let t=0;t<b;t++){const s=l.getCamera(t);if(d.isPointLight){const e=l.camera,s=l.matrix,n=d.distance||e.far;n!==e.far&&(e.far=n,e.updateProjectionMatrix()),_lightPositionWorld.setFromMatrixPosition(d.matrixWorld),e.position.copy(_lightPositionWorld),_lookTarget.copy(e.position),_lookTarget.add(_cubeDirections[t]),e.up.copy(_cubeUps[t]),e.lookAt(_lookTarget),e.updateMatrixWorld(),s.makeTranslation(-_lightPositionWorld.x,-_lightPositionWorld.y,-_lightPositionWorld.z),_projScreenMatrix.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),l._frustum.setFromProjectionMatrix(_projScreenMatrix,e.coordinateSystem,e.reversedDepth)}if(l.map.isWebGLCubeRenderTarget)e.setRenderTarget(l.map,t),e.clear();else{t===0&&(e.setRenderTarget(l.map),e.clear());const n=l.getViewport(t);p.set(o.x*n.x,o.y*n.y,o.x*n.z,o.y*n.w),a.viewport(p)}f=l.getFrustum(t),m(n,i,s,d,y,this.type)}l.isPointLightShadow!==!0&&this.type===VSMShadowMap&&j(l,i),l.needsUpdate=!1}v=this.type,l.needsUpdate=!1,e.setRenderTarget(d,u,h)};function j(n,o){const r=t.update(d);i.defines.VSM_SAMPLES!==n.blurSamples&&(i.defines.VSM_SAMPLES=n.blurSamples,a.defines.VSM_SAMPLES=n.blurSamples,i.needsUpdate=!0,a.needsUpdate=!0),n.mapPass===null?n.mapPass=new WebGLRenderTarget(s.x,s.y,{format:RGFormat,type:HalfFloatType}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),i.uniforms.shadow_pass.value=n.map.depthTexture,i.uniforms.resolution.value.set(n.map.width,n.map.height),i.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(o,null,r,i,d,null),a.uniforms.shadow_pass.value=n.mapPass.texture,a.uniforms.resolution.value.set(n.map.width,n.map.height),a.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(o,null,r,a,d,null)}function u(t,n,s,o){let i=null;const a=s.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(a!==0[0])i=a;else if(i=s.isPointLight===!0?_:b,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){const s=i.uuid,o=n.uuid;let e=c[s];e===0[0]&&(e={},c[s]=e);let t=e[o];t===0[0]&&(t=i.clone(),e[o]=t,n.addEventListener("dispose",h)),i=t}if(i.visible=n.visible,i.wireframe=n.wireframe,o===VSMShadowMap?i.side=n.shadowSide!==null?n.shadowSide:n.side:i.side=n.shadowSide!==null?n.shadowSide:y[n.side],i.alphaMap=n.alphaMap,i.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,i.map=n.map,i.clipShadows=n.clipShadows,i.clippingPlanes=n.clippingPlanes,i.clipIntersection=n.clipIntersection,i.displacementMap=n.displacementMap,i.displacementScale=n.displacementScale,i.displacementBias=n.displacementBias,i.wireframeLinewidth=n.wireframeLinewidth,i.linewidth=n.linewidth,s.isPointLight===!0&&i.isMeshDistanceMaterial===!0){const t=e.properties.get(i);t.light=s}return i}function m(n,s,o,i,a,r){if(n.visible===!1)return;const l=n.layers.test(a);if(l&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&r===VSMShadowMap)&&(!n.frustumCulled||n.intersectsFrustum(f))){n.modelViewMatrix.multiplyMatrices(o.matrixWorldInverse,n.matrixWorld);const a=t.update(n),c=n.material;if(Array.isArray(c)){{const t=a.groups;for(let d=0,m=t.length;d<m;d++){const l=t[d],h=c[l.materialIndex];if(h&&h.visible){const t=u(n,h,i,r);n.onBeforeShadow(e,n,s,o,a,t,l),e.renderBufferDirect(o,null,a,t,n,l),n.onAfterShadow(e,n,s,o,a,t,l)}}}}else if(c.visible){const t=u(n,c,i,r);n.onBeforeShadow(e,n,s,o,a,t,null),e.renderBufferDirect(o,null,a,t,n,null),n.onAfterShadow(e,n,s,o,a,t,null)}}const c=n.children;for(let e=0,t=c.length;e<t;e++)m(c[e],s,o,i,a,r)}function h(e){const t=e.target;t.removeEventListener("dispose",h);for(const s in c){const t=c[s],n=e.target.uuid;if(n in t){const e=t[n];e.dispose(),delete t[n]}}}}function WebGLState(e,t){function ie(){let t=!1;const n=new Vector4;let s=null;const o=new Vector4(0,0,0,0);return{setMask:function(n){s!==n&&!t&&(e.colorMask(n,n,n,n),s=n)},setLocked:function(e){t=e},setClear:function(t,s,i,a,r){r===!0&&(t*=a,s*=a,i*=a),n.set(t,s,i,a),o.equals(n)===!1&&(e.clearColor(t,s,i,a),o.copy(n))},reset:function(){t=!1,s=null,o.set(-1,0,0,0)}}}function Q(){let a=!1,o=!1,r=null,c=null,i=null;return{setReversed:function(e){if(o!==e){const n=t.get("EXT_clip_control");e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),o=e;const s=i;i=null,this.setClear(s)}},getReversed:function(){return o},setTest:function(t){t?n(e.DEPTH_TEST):s(e.DEPTH_TEST)},setMask:function(t){r!==t&&!a&&(e.depthMask(t),r=t)},setFunc:function(t){if(o&&(t=ReversedDepthFuncs[t]),c!==t){switch(t){case NeverDepth:e.depthFunc(e.NEVER);break;case AlwaysDepth:e.depthFunc(e.ALWAYS);break;case LessDepth:e.depthFunc(e.LESS);break;case LessEqualDepth:e.depthFunc(e.LEQUAL);break;case EqualDepth:e.depthFunc(e.EQUAL);break;case GreaterEqualDepth:e.depthFunc(e.GEQUAL);break;case GreaterDepth:e.depthFunc(e.GREATER);break;case NotEqualDepth:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}c=t}},setLocked:function(e){a=e},setClear:function(t){i!==t&&(i=t,o&&(t=1-t),e.clearDepth(t))},reset:function(){a=!1,r=null,c=null,i=null,o=!1}}}function X(){let t=!1,o=null,i=null,a=null,r=null,c=null,l=null,d=null,u=null;return{setTest:function(o){t||(o?n(e.STENCIL_TEST):s(e.STENCIL_TEST))},setMask:function(n){o!==n&&!t&&(e.stencilMask(n),o=n)},setFunc:function(t,n,s){(i!==t||a!==n||r!==s)&&(e.stencilFunc(t,n,s),i=t,a=n,r=s)},setOp:function(t,n,s){(c!==t||l!==n||d!==s)&&(e.stencilOp(t,n,s),c=t,l=n,d=s)},setLocked:function(e){t=e},setClear:function(t){u!==t&&(e.clearStencil(t),u=t)},reset:function(){t=!1,o=null,i=null,a=null,r=null,c=null,l=null,d=null,u=null}}}const p=new ie,o=new Q,a=new X;let P={};const H=new WeakMap;let d={},u={},h={},B=new WeakMap,W=[],V=null,r=!1,v=null,m=null,j=null,y=null,l=null,w=null,O=null,x=new Color(0,0,0),C=0,E=!1,R=null,L=null,N=null,D=null,T=null;const $=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,g=0;const S=e.getParameter(e.VERSION);S.indexOf("WebGL")!==-1?(g=parseFloat(/^WebGL (\d)/.exec(S)[1]),z=g>=1):S.indexOf("OpenGL ES")!==-1&&(g=parseFloat(/^OpenGL ES (\d)/.exec(S)[1]),z=g>=2);let i=null,k={};const G=e.getParameter(e.SCISSOR_BOX),ne=e.getParameter(e.VIEWPORT),I=(new Vector4).fromArray(G),M=(new Vector4).fromArray(ne);function _(t,n,s,o){const i=new Uint8Array(4),a=e.createTexture();e.bindTexture(t,a),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let a=0;a<s;a++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,o,0,e.RGBA,e.UNSIGNED_BYTE,i):e.texImage2D(n+a,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,i);return a}const c={};c[e.TEXTURE_2D]=_(e.TEXTURE_2D,e.TEXTURE_2D,1),c[e.TEXTURE_CUBE_MAP]=_(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),c[e.TEXTURE_2D_ARRAY]=_(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),c[e.TEXTURE_3D]=_(e.TEXTURE_3D,e.TEXTURE_3D,1,1),p.setClear(0,0,0,1),o.setClear(1),a.setClear(0),n(e.DEPTH_TEST),o.setFunc(LessEqualDepth),F(!1),K(CullFaceBack),n(e.CULL_FACE),A(NoBlending);function n(t){d[t]!==!0&&(e.enable(t),d[t]=!0)}function s(t){d[t]!==!1&&(e.disable(t),d[t]=!1)}function ee(t,n){return h[t]!==n&&(e.bindFramebuffer(t,n),h[t]=n,t===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=n),!0)}function J(t,n){let s=W,o=!1;if(t){{s=B.get(n),s===0[0]&&(s=[],B.set(n,s));const i=t.textures;if(s.length!==i.length||s[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=i.length;t<n;t++)s[t]=e.COLOR_ATTACHMENT0+t;s.length=i.length,o=!0}}}else s[0]!==e.BACK&&(s[0]=e.BACK,o=!0);o&&e.drawBuffers(s)}function ce(t){return V!==t&&(e.useProgram(t),V=t,!0)}const b={[AddEquation]:e.FUNC_ADD,[SubtractEquation]:e.FUNC_SUBTRACT,[ReverseSubtractEquation]:e.FUNC_REVERSE_SUBTRACT};b[MinEquation]=e.MIN,b[MaxEquation]=e.MAX;const f={[ZeroFactor]:e.ZERO,[OneFactor]:e.ONE,[SrcColorFactor]:e.SRC_COLOR,[SrcAlphaFactor]:e.SRC_ALPHA,[SrcAlphaSaturateFactor]:e.SRC_ALPHA_SATURATE,[DstColorFactor]:e.DST_COLOR,[DstAlphaFactor]:e.DST_ALPHA,[OneMinusSrcColorFactor]:e.ONE_MINUS_SRC_COLOR,[OneMinusSrcAlphaFactor]:e.ONE_MINUS_SRC_ALPHA,[OneMinusDstColorFactor]:e.ONE_MINUS_DST_COLOR,[OneMinusDstAlphaFactor]:e.ONE_MINUS_DST_ALPHA,[ConstantColorFactor]:e.CONSTANT_COLOR,[OneMinusConstantColorFactor]:e.ONE_MINUS_CONSTANT_COLOR,[ConstantAlphaFactor]:e.CONSTANT_ALPHA,[OneMinusConstantAlphaFactor]:e.ONE_MINUS_CONSTANT_ALPHA};function A(t,o,i,a,c,d,u,h,p,g){if(t===NoBlending){r===!0&&(s(e.BLEND),r=!1);return}if(r===!1&&(n(e.BLEND),r=!0),t!==CustomBlending){if(t!==v||g!==E){if((m!==AddEquation||l!==AddEquation)&&(e.blendEquation(e.FUNC_ADD),m=AddEquation,l=AddEquation),g)switch(t){case NormalBlending:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case AdditiveBlending:e.blendFunc(e.ONE,e.ONE);break;case SubtractiveBlending:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case MultiplyBlending:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:error("WebGLState: Invalid blending: ",t);break}else switch(t){case NormalBlending:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case AdditiveBlending:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case SubtractiveBlending:error("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case MultiplyBlending:error("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:error("WebGLState: Invalid blending: ",t);break}j=null,y=null,w=null,O=null,x.set(0,0,0),C=0,v=t,E=g}return}c=c||o,d=d||i,u=u||a,(o!==m||c!==l)&&(e.blendEquationSeparate(b[o],b[c]),m=o,l=c),(i!==j||a!==y||d!==w||u!==O)&&(e.blendFuncSeparate(f[i],f[a],f[d],f[u]),j=i,y=a,w=d,O=u),(h.equals(x)===!1||p!==C)&&(e.blendColor(h.r,h.g,h.b,p),x.copy(h),C=p),v=t,E=!1}function Z(t,i){t.side===DoubleSide?s(e.CULL_FACE):n(e.CULL_FACE);let r=t.side===BackSide;i&&(r=!r),F(r),t.blending===NormalBlending&&t.transparent===!1?A(NoBlending):A(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),p.setMask(t.colorWrite);const c=t.stencilWrite;a.setTest(c),c&&(a.setMask(t.stencilWriteMask),a.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),a.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),U(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?n(e.SAMPLE_ALPHA_TO_COVERAGE):s(e.SAMPLE_ALPHA_TO_COVERAGE)}function F(t){R!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),R=t)}function K(t){t!==CullFaceNone?(n(e.CULL_FACE),t!==L&&(t===CullFaceBack?e.cullFace(e.BACK):t===CullFaceFront?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):s(e.CULL_FACE),L=t}function te(t){t!==N&&(z&&e.lineWidth(t),N=t)}function U(t,i,a){t?(n(e.POLYGON_OFFSET_FILL),(D!==i||T!==a)&&(D=i,T=a,o.getReversed()&&(i=-i,a=-a),e.polygonOffset(i,a))):s(e.POLYGON_OFFSET_FILL)}function se(t){t?n(e.SCISSOR_TEST):s(e.SCISSOR_TEST)}function oe(t){t===0[0]&&(t=e.TEXTURE0+$-1),i!==t&&(e.activeTexture(t),i=t)}function q(t,n,s){s===0[0]&&(i===null?s=e.TEXTURE0+$-1:s=i);let o=k[s];o===0[0]&&(o={type:0[0],texture:0[0]},k[s]=o),(o.type!==t||o.texture!==n)&&(i!==s&&(e.activeTexture(s),i=s),e.bindTexture(t,n||c[t]),o.type=t,o.texture=n)}function ae(){const t=k[i];t!==0[0]&&t.type!==0[0]&&(e.bindTexture(t.type,null),t.type=0[0],t.texture=0[0])}function re(){try{e.compressedTexImage2D(...arguments)}catch(e){error("WebGLState:",e)}}function Y(){try{e.compressedTexImage3D(...arguments)}catch(e){error("WebGLState:",e)}}function le(){try{e.texSubImage2D(...arguments)}catch(e){error("WebGLState:",e)}}function de(){try{e.texSubImage3D(...arguments)}catch(e){error("WebGLState:",e)}}function ue(){try{e.compressedTexSubImage2D(...arguments)}catch(e){error("WebGLState:",e)}}function he(){try{e.compressedTexSubImage3D(...arguments)}catch(e){error("WebGLState:",e)}}function me(){try{e.texStorage2D(...arguments)}catch(e){error("WebGLState:",e)}}function fe(){try{e.texStorage3D(...arguments)}catch(e){error("WebGLState:",e)}}function pe(){try{e.texImage2D(...arguments)}catch(e){error("WebGLState:",e)}}function ge(){try{e.texImage3D(...arguments)}catch(e){error("WebGLState:",e)}}function ve(t){return u[t]!==0[0]?u[t]:e.getParameter(t)}function be(t,n){u[t]!==n&&(e.pixelStorei(t,n),u[t]=n)}function je(t){I.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),I.copy(t))}function ye(t){M.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),M.copy(t))}function _e(t,n){let s=H.get(n);s===0[0]&&(s=new WeakMap,H.set(n,s));let o=s.get(t);o===0[0]&&(o=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,o,o),s.set(t,o))}function we(t,n,s){const i=H.get(n),o=i.get(t);P[o]!==s&&(e.bindBufferBase(e.UNIFORM_BUFFER,o,s),P[o]=s)}function Oe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),d={},u={},i=null,k={},h={},P={},B=new WeakMap,W=[],V=null,r=!1,v=null,m=null,j=null,y=null,l=null,w=null,O=null,x=new Color(0,0,0),C=0,E=!1,R=null,L=null,N=null,D=null,T=null,I.set(0,0,e.canvas.width,e.canvas.height),M.set(0,0,e.canvas.width,e.canvas.height),p.reset(),o.reset(),a.reset()}return{buffers:{color:p,depth:o,stencil:a},enable:n,disable:s,bindFramebuffer:ee,drawBuffers:J,useProgram:ce,setBlending:A,setMaterial:Z,setFlipSided:F,setCullFace:K,setLineWidth:te,setPolygonOffset:U,setScissorTest:se,activeTexture:oe,bindTexture:q,unbindTexture:ae,compressedTexImage2D:re,compressedTexImage3D:Y,texImage2D:pe,texImage3D:ge,pixelStorei:be,getParameter:ve,updateUBOMapping:_e,uniformBlockBinding:we,texStorage2D:me,texStorage3D:fe,texSubImage2D:le,texSubImage3D:de,compressedTexSubImage2D:ue,compressedTexSubImage3D:he,scissor:je,viewport:ye,reset:Oe}}function WebGLTextures(e,t,n,s,o,i,a){const b=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,Y=typeof navigator!="undefined"&&/OculusBrowser/g.test(navigator.userAgent),l=new Vector2,k=new WeakMap,y=new Set;let w;const m=new WeakMap,v=new Set,q=new FinalizationRegistry(e=>v.delete(e));let U=!1;try{U=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(e,t){return U?new OffscreenCanvas(e,t):createElementNS("canvas")}function V(e,t,n){let o=1;const s=_(e);if((s.width>n||s.height>n)&&(o=n/Math.max(s.width,s.height)),o<1){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap||typeof VideoFrame!="undefined"&&e instanceof VideoFrame){const n=Math.floor(o*s.width),i=Math.floor(o*s.height);w===0[0]&&(w=T(n,i));const a=t?T(n,i):w;a.width=n,a.height=i;const r=a.getContext("2d");return r.drawImage(e,0,0,n,i),warn("WebGLRenderer: Texture has been resized from ("+s.width+"x"+s.height+") to ("+n+"x"+i+")."),a}return"data"in e&&warn("WebGLRenderer: Image in DataTexture is too big ("+s.width+"x"+s.height+")."),e}return e}function d(e){return e.generateMipmaps}function h(t){e.generateMipmap(t)}function me(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function f(n,s,o,i,a,r=!1){if(n!==null){if(e[n]!==0[0])return e[n];warn("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+n+"'")}let l;i&&(l=t.get("EXT_texture_norm16"),l||warn("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let c=s;if(s===e.RED&&(o===e.FLOAT&&(c=e.R32F),o===e.HALF_FLOAT&&(c=e.R16F),o===e.UNSIGNED_BYTE&&(c=e.R8),o===e.UNSIGNED_SHORT&&l&&(c=l.R16_EXT),o===e.SHORT&&l&&(c=l.R16_SNORM_EXT)),s===e.RED_INTEGER&&(o===e.UNSIGNED_BYTE&&(c=e.R8UI),o===e.UNSIGNED_SHORT&&(c=e.R16UI),o===e.UNSIGNED_INT&&(c=e.R32UI),o===e.BYTE&&(c=e.R8I),o===e.SHORT&&(c=e.R16I),o===e.INT&&(c=e.R32I)),s===e.RG&&(o===e.FLOAT&&(c=e.RG32F),o===e.HALF_FLOAT&&(c=e.RG16F),o===e.UNSIGNED_BYTE&&(c=e.RG8),o===e.UNSIGNED_SHORT&&l&&(c=l.RG16_EXT),o===e.SHORT&&l&&(c=l.RG16_SNORM_EXT)),s===e.RG_INTEGER&&(o===e.UNSIGNED_BYTE&&(c=e.RG8UI),o===e.UNSIGNED_SHORT&&(c=e.RG16UI),o===e.UNSIGNED_INT&&(c=e.RG32UI),o===e.BYTE&&(c=e.RG8I),o===e.SHORT&&(c=e.RG16I),o===e.INT&&(c=e.RG32I)),s===e.RGB_INTEGER&&(o===e.UNSIGNED_BYTE&&(c=e.RGB8UI),o===e.UNSIGNED_SHORT&&(c=e.RGB16UI),o===e.UNSIGNED_INT&&(c=e.RGB32UI),o===e.BYTE&&(c=e.RGB8I),o===e.SHORT&&(c=e.RGB16I),o===e.INT&&(c=e.RGB32I)),s===e.RGBA_INTEGER&&(o===e.UNSIGNED_BYTE&&(c=e.RGBA8UI),o===e.UNSIGNED_SHORT&&(c=e.RGBA16UI),o===e.UNSIGNED_INT&&(c=e.RGBA32UI),o===e.BYTE&&(c=e.RGBA8I),o===e.SHORT&&(c=e.RGBA16I),o===e.INT&&(c=e.RGBA32I)),s===e.RGB&&(o===e.UNSIGNED_SHORT&&l&&(c=l.RGB16_EXT),o===e.SHORT&&l&&(c=l.RGB16_SNORM_EXT),o===e.UNSIGNED_INT_5_9_9_9_REV&&(c=e.RGB9_E5),o===e.UNSIGNED_INT_10F_11F_11F_REV&&(c=e.R11F_G11F_B10F)),s===e.RGBA){const t=r?LinearTransfer:ColorManagement.getTransfer(a);o===e.FLOAT&&(c=e.RGBA32F),o===e.HALF_FLOAT&&(c=e.RGBA16F),o===e.UNSIGNED_BYTE&&(c=t===SRGBTransfer?e.SRGB8_ALPHA8:e.RGBA8),o===e.UNSIGNED_SHORT&&l&&(c=l.RGBA16_EXT),o===e.SHORT&&l&&(c=l.RGBA16_SNORM_EXT),o===e.UNSIGNED_SHORT_4_4_4_4&&(c=e.RGBA4),o===e.UNSIGNED_SHORT_5_5_5_1&&(c=e.RGB5_A1)}return(c===e.R16F||c===e.R32F||c===e.RG16F||c===e.RG32F||c===e.RGBA16F||c===e.RGBA32F)&&t.get("EXT_color_buffer_float"),c}function O(t,n){let s;return t?n===null||n===UnsignedIntType||n===UnsignedInt248Type?s=e.DEPTH24_STENCIL8:n===FloatType?s=e.DEPTH32F_STENCIL8:n===UnsignedShortType&&(s=e.DEPTH24_STENCIL8,warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):n===null||n===UnsignedIntType||n===UnsignedInt248Type?s=e.DEPTH_COMPONENT24:n===FloatType?s=e.DEPTH_COMPONENT32F:n===UnsignedShortType&&(s=e.DEPTH_COMPONENT16),s}function I(e,t){return d(e)===!0||e.isFramebufferTexture&&e.minFilter!==NearestFilter&&e.minFilter!==LinearFilter?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function H(e){const t=new WeakRef(e);s.get(e).__ref=t,v.add(t),q.register(e,t,t)}function P(e){const t=s.get(e).__ref;if(t===0[0])return;v.delete(t),q.unregister(t)}function R(e){S(e.target)}function L(e){N(e.target)}function S(e){e.removeEventListener("dispose",R),P(e),de(e),e.isVideoTexture&&k.delete(e),e.isHTMLTexture&&y.delete(e)}function N(e){e.removeEventListener("dispose",L),P(e),le(e)}function he(){for(const t of v){const e=t.deref();if(e===0[0])continue;e.isRenderTarget===!0?N(e):S(e)}v.clear(),y.clear()}function de(e){const n=s.get(e);if(n.__webglInit===0[0])return;const o=e.source,t=m.get(o);if(t){const s=t[n.__cacheKey];s.usedTimes--,s.usedTimes===0&&z(e),Object.keys(t).length===0&&m.delete(o)}s.remove(e)}function z(t){const n=s.get(t);e.deleteTexture(n.__webglTexture);const o=t.source,i=m.get(o);delete i[n.__cacheKey],a.memory.textures--}function le(t){const n=s.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();const o=t.depthTexture;if(o&&o.renderTarget===t&&S(o),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let s=0;s<n.__webglFramebuffer[t].length;s++)e.deleteFramebuffer(n.__webglFramebuffer[t][s]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}const i=t.textures;for(let t=0,o=i.length;t<o;t++){const n=s.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),a.memory.textures--),s.remove(i[t])}s.remove(t)}let g=0;function re(){g=0}function G(){return g}function se(e){g=e}function ne(){const e=g;return e>=o.maxTextures&&warn("WebGLTextures: Trying to use "+(e+1)+" texture units while this GPU supports only "+o.maxTextures),g+=1,e}function te(e){const t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function B(t,o){const i=s.get(t);if(t.isVideoTexture&&ue(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&i.__version!==t.version){const e=t.image;if(e===null)warn("WebGLRenderer: Texture marked for update but no image data found.");else if(e.complete===!1)warn("WebGLRenderer: Texture marked for update but image is incomplete");else{A(i,t,o);return}}else t.isExternalTexture&&(i.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,i.__webglTexture,e.TEXTURE0+o)}function ee(t,o){const i=s.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&i.__version!==t.version){A(i,t,o);return}t.isExternalTexture&&(i.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,i.__webglTexture,e.TEXTURE0+o)}function Z(t,o){const i=s.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&i.__version!==t.version){A(i,t,o);return}n.bindTexture(e.TEXTURE_3D,i.__webglTexture,e.TEXTURE0+o)}function W(t,o){const i=s.get(t);if(t.version>0&&i.__version!==t.version){J(i,t,o);return}n.bindTexture(e.TEXTURE_CUBE_MAP,i.__webglTexture,e.TEXTURE0+o)}const M={[RepeatWrapping]:e.REPEAT,[ClampToEdgeWrapping]:e.CLAMP_TO_EDGE,[MirroredRepeatWrapping]:e.MIRRORED_REPEAT},K={[NearestFilter]:e.NEAREST,[NearestMipmapNearestFilter]:e.NEAREST_MIPMAP_NEAREST,[NearestMipmapLinearFilter]:e.NEAREST_MIPMAP_LINEAR,[LinearFilter]:e.LINEAR,[LinearMipmapNearestFilter]:e.LINEAR_MIPMAP_NEAREST,[LinearMipmapLinearFilter]:e.LINEAR_MIPMAP_LINEAR},X={[NeverCompare]:e.NEVER,[AlwaysCompare]:e.ALWAYS,[LessCompare]:e.LESS,[LessEqualCompare]:e.LEQUAL,[EqualCompare]:e.EQUAL,[GreaterEqualCompare]:e.GEQUAL,[GreaterCompare]:e.GREATER,[NotEqualCompare]:e.NOTEQUAL};function p(n,i){if(i.type===FloatType&&t.has("OES_texture_float_linear")===!1&&(i.magFilter===LinearFilter||i.magFilter===LinearMipmapNearestFilter||i.magFilter===NearestMipmapLinearFilter||i.magFilter===LinearMipmapLinearFilter||i.minFilter===LinearFilter||i.minFilter===LinearMipmapNearestFilter||i.minFilter===NearestMipmapLinearFilter||i.minFilter===LinearMipmapLinearFilter)&&warn("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(n,e.TEXTURE_WRAP_S,M[i.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,M[i.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,M[i.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,K[i.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,K[i.minFilter]),i.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,X[i.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(i.magFilter===NearestFilter)return;if(i.minFilter!==NearestMipmapLinearFilter&&i.minFilter!==LinearMipmapLinearFilter)return;if(i.type===FloatType&&t.has("OES_texture_float_linear")===!1)return;if(i.anisotropy>1||s.get(i).__currentAnisotropy){const a=t.get("EXT_texture_filter_anisotropic");e.texParameterf(n,a.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(i.anisotropy,o.getMaxAnisotropy())),s.get(i).__currentAnisotropy=i.anisotropy}}}function $(t,n){let i=!1;t.__webglInit===0[0]&&(t.__webglInit=!0,n.addEventListener("dispose",R),H(n));const r=n.source;let s=m.get(r);s===0[0]&&(s={},m.set(r,s));const o=te(n);if(o!==t.__cacheKey){s[o]===0[0]&&(s[o]={texture:e.createTexture(),usedTimes:0},a.memory.textures++,i=!0),s[o].usedTimes++;const r=s[t.__cacheKey];r!==0[0]&&(s[t.__cacheKey].usedTimes--,r.usedTimes===0&&z(n)),t.__cacheKey=o,t.__webglTexture=s[o].texture}return i}function F(e,t,n){return Math.floor(Math.floor(e/n)/t)}function Q(t,s,o,i){const r=4,a=t.updateRanges;if(a.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,s.width,s.height,o,i,s.data);else{a.sort((e,t)=>e.start-t.start);let c=0;for(let n=1;n<a.length;n++){const t=a[c],e=a[n],i=t.start+t.count,o=F(e.start,s.width,r),l=F(t.start,s.width,r);e.start<=i+1&&o===l&&F(e.start+e.count-1,s.width,r)===o?t.count=Math.max(t.count,e.start+e.count-t.start):(++c,a[c]=e)}a.length=c+1;const l=n.getParameter(e.UNPACK_ROW_LENGTH),d=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,s.width);for(let t=0,h=a.length;t<h;t++){const c=a[t],l=Math.floor(c.start/r),m=Math.ceil(c.count/r),d=l%s.width,u=Math.floor(l/s.width),f=m,p=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,d),n.pixelStorei(e.UNPACK_SKIP_ROWS,u),n.texSubImage2D(e.TEXTURE_2D,0,d,u,f,p,o,i,s.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,l),n.pixelStorei(e.UNPACK_SKIP_PIXELS,d),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function A(t,a,r){let c=e.TEXTURE_2D;(a.isDataArrayTexture||a.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),a.isData3DTexture&&(c=e.TEXTURE_3D);const m=$(t,a),l=a.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+r);const u=s.get(l);if(l.version!==u.__version||m===!0){n.activeTexture(e.TEXTURE0+r);const k=typeof ImageBitmap!="undefined"&&a.image instanceof ImageBitmap;if(k===!1){const t=ColorManagement.getPrimaries(ColorManagement.workingColorSpace),s=a.colorSpace===NoColorSpace?null:ColorManagement.getPrimaries(a.colorSpace),o=a.colorSpace===NoColorSpace||t===s?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,a.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,o)}n.pixelStorei(e.UNPACK_ALIGNMENT,a.unpackAlignment);let t=V(a.image,!1,o.maxTextureSize);t=D(a,t);const g=i.convert(a.format,a.colorSpace),b=i.convert(a.type);let v=f(a.internalFormat,g,b,a.normalized,a.colorSpace,a.isVideoTexture);p(c,a);let s;const j=a.mipmaps,w=a.isVideoTexture!==!0,x=u.__version===0[0]||m===!0,C=l.dataReady,E=I(a,t);if(a.isDepthTexture)v=O(a.format===DepthStencilFormat,a.type),x&&(w?n.texStorage2D(e.TEXTURE_2D,1,v,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,v,t.width,t.height,0,g,b,null));else if(a.isDataTexture)if(j.length>0){w&&x&&n.texStorage2D(e.TEXTURE_2D,E,v,j[0].width,j[0].height);for(let t=0,o=j.length;t<o;t++)s=j[t],w?C&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,s.width,s.height,g,b,s.data):n.texImage2D(e.TEXTURE_2D,t,v,s.width,s.height,0,g,b,s.data);a.generateMipmaps=!1}else w?(x&&n.texStorage2D(e.TEXTURE_2D,E,v,t.width,t.height),C&&Q(a,t,g,b)):n.texImage2D(e.TEXTURE_2D,0,v,t.width,t.height,0,g,b,t.data);else if(a.isCompressedTexture)if(a.isCompressedArrayTexture){w&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,v,j[0].width,j[0].height,t.depth);for(let o=0,i=j.length;o<i;o++)if(s=j[o],a.format!==RGBAFormat)if(g!==null)if(w){if(C)if(a.layerUpdates.size>0){const t=getByteLength(s.width,s.height,a.format,a.type);for(const i of a.layerUpdates){const r=s.data.subarray(i*t/s.data.BYTES_PER_ELEMENT,(i+1)*t/s.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,o,0,0,i,s.width,s.height,1,g,r)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,o,0,0,0,s.width,s.height,t.depth,g,s.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,o,v,s.width,s.height,t.depth,0,s.data,0,0);else warn("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else w?C&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,o,0,0,0,s.width,s.height,t.depth,g,b,s.data):n.texImage3D(e.TEXTURE_2D_ARRAY,o,v,s.width,s.height,t.depth,0,g,b,s.data);a.layerUpdates.size>0&&a.clearLayerUpdates()}else{w&&x&&n.texStorage2D(e.TEXTURE_2D,E,v,j[0].width,j[0].height);for(let t=0,o=j.length;t<o;t++)s=j[t],a.format!==RGBAFormat?g!==null?w?C&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,s.width,s.height,g,s.data):n.compressedTexImage2D(e.TEXTURE_2D,t,v,s.width,s.height,0,s.data):warn("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):w?C&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,s.width,s.height,g,b,s.data):n.texImage2D(e.TEXTURE_2D,t,v,s.width,s.height,0,g,b,s.data)}else if(a.isDataArrayTexture)if(w){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,v,t.width,t.height,t.depth),C)if(a.layerUpdates.size>0){const s=getByteLength(t.width,t.height,a.format,a.type);for(const o of a.layerUpdates){const i=t.data.subarray(o*s/t.data.BYTES_PER_ELEMENT,(o+1)*s/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,o,t.width,t.height,1,g,b,i)}a.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,g,b,t.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,v,t.width,t.height,t.depth,0,g,b,t.data);else if(a.isData3DTexture)w?(x&&n.texStorage3D(e.TEXTURE_3D,E,v,t.width,t.height,t.depth),C&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,g,b,t.data)):n.texImage3D(e.TEXTURE_3D,0,v,t.width,t.height,t.depth,0,g,b,t.data);else if(a.isFramebufferTexture){if(x)if(w)n.texStorage2D(e.TEXTURE_2D,E,v,t.width,t.height);else{let s=t.width,o=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,v,s,o,0,g,b,null),s>>=1,o>>=1}}else if(a.isHTMLTexture){if("texElementImage2D"in e){const n=e.canvas;if(n.hasAttribute("layoutsubtree")||n.setAttribute("layoutsubtree","true"),t.parentNode!==n){n.appendChild(t),y.add(a),n.onpaint=e=>{const t=e.changedElements;for(const e of y)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{const n=0,s=e.RGBA,o=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,n,s,o,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(j.length>0){if(w&&x){const t=_(j[0]);n.texStorage2D(e.TEXTURE_2D,E,v,t.width,t.height)}for(let t=0,o=j.length;t<o;t++)s=j[t],w?C&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,g,b,s):n.texImage2D(e.TEXTURE_2D,t,v,g,b,s);a.generateMipmaps=!1}else if(w){if(x){const s=_(t);n.texStorage2D(e.TEXTURE_2D,E,v,s.width,s.height)}C&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,g,b,t)}else n.texImage2D(e.TEXTURE_2D,0,v,g,b,t);d(a)&&a.mipmapsAutoUpdate===!0&&h(c),u.__version=l.version,a.onUpdate&&a.onUpdate(a)}t.__version=a.version}function J(t,a,r){if(a.image.length!==6)return;const u=$(t,a),c=a.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+r);const l=s.get(c);if(c.version!==l.__version||u===!0){n.activeTexture(e.TEXTURE0+r);const k=ColorManagement.getPrimaries(ColorManagement.workingColorSpace),S=a.colorSpace===NoColorSpace?null:ColorManagement.getPrimaries(a.colorSpace),A=a.colorSpace===NoColorSpace||k===S?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,a.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,a.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,A);const E=a.isCompressedTexture||a.image[0].isCompressedTexture,w=a.image[0]&&a.image[0].isDataTexture,t=[];for(let e=0;e<6;e++)!E&&!w?t[e]=V(a.image[e],!0,o.maxCubemapSize):t[e]=w?a.image[e].image:a.image[e],t[e]=D(a,t[e]);const j=t[0],s=i.convert(a.format,a.colorSpace),m=i.convert(a.type);let g=f(a.internalFormat,s,m,a.normalized,a.colorSpace);const b=a.isVideoTexture!==!0,x=l.__version===0[0]||u===!0,y=c.dataReady;let C=I(a,j);p(e.TEXTURE_CUBE_MAP,a);let v;if(a.isDepthTexture){if(g=O(a.format===DepthStencilFormat,a.type),x)if(b)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,g,j.width,j.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,g,j.width,j.height,0,s,m,null)}else if(E){b&&x&&n.texStorage2D(e.TEXTURE_CUBE_MAP,C,g,j.width,j.height);for(let o=0;o<6;o++){v=t[o].mipmaps;for(let i=0;i<v.length;i++){const t=v[i];a.format!==RGBAFormat?s!==null?b?y&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,i,0,0,t.width,t.height,s,t.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,i,g,t.width,t.height,0,t.data):warn("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):b?y&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,i,0,0,t.width,t.height,s,m,t.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,i,g,t.width,t.height,0,s,m,t.data)}}}else{if(v=a.mipmaps,b&&x){v.length>0&&C++;const s=_(t[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,C,g,s.width,s.height)}for(let o=0;o<6;o++)if(w){b?y&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,0,0,0,t[o].width,t[o].height,s,m,t[o].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,0,g,t[o].width,t[o].height,0,s,m,t[o].data);for(let i=0;i<v.length;i++){const a=v[i],t=a.image[o].image;b?y&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,i+1,0,0,t.width,t.height,s,m,t.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,i+1,g,t.width,t.height,0,s,m,t.data)}}else{b?y&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,0,0,0,s,m,t[o]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,0,g,s,m,t[o]);for(let t=0;t<v.length;t++){const i=v[t];b?y&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,t+1,0,0,s,m,i.image[o]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+o,t+1,g,s,m,i.image[o])}}}d(a)&&a.mipmapsAutoUpdate===!0&&h(e.TEXTURE_CUBE_MAP),l.__version=c.version,a.onUpdate&&a.onUpdate(a)}t.__version=a.version}function u(t,o,a,l,d,u){const h=i.convert(a.format,a.colorSpace),m=i.convert(a.type),g=f(a.internalFormat,h,m,a.normalized,a.colorSpace),v=s.get(o),p=s.get(a);if(p.__renderTarget=o,!v.__hasExternalTextures){const t=Math.max(1,o.width>>u),s=Math.max(1,o.height>>u);d===e.TEXTURE_3D||d===e.TEXTURE_2D_ARRAY?n.texImage3D(d,u,g,t,s,o.depth,0,h,m,null):n.texImage2D(d,u,g,t,s,0,h,m,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),r(o)?b.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,d,p.__webglTexture,0,c(o)):(d===e.TEXTURE_2D||d>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&d<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,l,d,p.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function x(t,n,s){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){const o=n.depthTexture,a=o&&o.isDepthTexture?o.type:null,i=O(n.stencilBuffer,a),l=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;r(n)?b.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,c(n),i,n.width,n.height):s?e.renderbufferStorageMultisample(e.RENDERBUFFER,c(n),i,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,i,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,l,e.RENDERBUFFER,t)}else{const t=n.textures;for(let a=0;a<t.length;a++){const o=t[a],d=i.convert(o.format,o.colorSpace),u=i.convert(o.type),l=f(o.internalFormat,d,u,o.normalized,o.colorSpace);r(n)?b.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,c(n),l,n.width,n.height):s?e.renderbufferStorageMultisample(e.RENDERBUFFER,c(n),l,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,l,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function C(t,o,i){const h=o.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!o.depthTexture||!o.depthTexture.isDepthTexture)throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const m=s.get(o.depthTexture);m.__renderTarget=o;const a=h?o.depthTexture.image[0]:o.depthTexture.image;(!m.__webglTexture||a.width!==o.width||a.height!==o.height)&&(a.width=o.width,a.height=o.height,o.depthTexture.needsUpdate=!0),h?W(o.depthTexture,0):B(o.depthTexture,0);const l=m.__webglTexture,f=c(o),d=h?e.TEXTURE_CUBE_MAP_POSITIVE_X+i:e.TEXTURE_2D,u=o.depthTexture.format===DepthStencilFormat?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(o.depthTexture.format===DepthFormat)r(o)?b.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,u,d,l,0,f):e.framebufferTexture2D(e.FRAMEBUFFER,u,d,l,0);else if(o.depthTexture.format===DepthStencilFormat)r(o)?b.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,u,d,l,0,f):e.framebufferTexture2D(e.FRAMEBUFFER,u,d,l,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function E(t){const o=s.get(t),i=t.isWebGLCubeRenderTarget===!0;if(o.__boundDepthTexture!==t.depthTexture){const e=t.depthTexture;if(o.__depthDisposeCallback&&o.__depthDisposeCallback(),e){const t=()=>{delete o.__boundDepthTexture,delete o.__depthDisposeCallback,e.removeEventListener("dispose",t)};e.addEventListener("dispose",t),o.__depthDisposeCallback=t}o.__boundDepthTexture=e}if(t.depthTexture&&!o.__autoAllocateDepthBuffer)if(i)for(let e=0;e<6;e++)C(o.__webglFramebuffer[e],t,e);else{const e=t.texture.mipmaps;e.length>0?C(o.__webglFramebuffer[0],t,0):C(o.__webglFramebuffer,t,0)}else if(i){o.__webglDepthbuffer=[];for(let s=0;s<6;s++)if(n.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer[s]),o.__webglDepthbuffer[s]===0[0])o.__webglDepthbuffer[s]=e.createRenderbuffer(),x(o.__webglDepthbuffer[s],t,!1);else{const i=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,n=o.__webglDepthbuffer[s];e.bindRenderbuffer(e.RENDERBUFFER,n),e.framebufferRenderbuffer(e.FRAMEBUFFER,i,e.RENDERBUFFER,n)}}else{const s=t.texture.mipmaps;if(s.length>0?n.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer),o.__webglDepthbuffer===0[0])o.__webglDepthbuffer=e.createRenderbuffer(),x(o.__webglDepthbuffer,t,!1);else{const s=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,n=o.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,n),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,n)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function oe(t,n,o){const i=s.get(t);n!==0[0]&&u(i.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),o!==0[0]&&E(t)}function ie(t){const o=t.texture,l=s.get(t),g=s.get(o);t.addEventListener("dispose",L),H(t);const m=t.textures,b=t.isWebGLCubeRenderTarget===!0,v=m.length>1;if(v||(g.__webglTexture===0[0]&&(g.__webglTexture=e.createTexture()),g.__version=o.version,a.memory.textures++),b){l.__webglFramebuffer=[];for(let t=0;t<6;t++)if(o.mipmaps.length>0){l.__webglFramebuffer[t]=[];for(let n=0;n<o.mipmaps.length;n++)l.__webglFramebuffer[t][n]=e.createFramebuffer()}else l.__webglFramebuffer[t]=e.createFramebuffer()}else{if(o.mipmaps.length>0){l.__webglFramebuffer=[];for(let t=0;t<o.mipmaps.length;t++)l.__webglFramebuffer[t]=e.createFramebuffer()}else l.__webglFramebuffer=e.createFramebuffer();if(v)for(let t=0,o=m.length;t<o;t++){const n=s.get(m[t]);n.__webglTexture===0[0]&&(n.__webglTexture=e.createTexture(),a.memory.textures++)}if(t.samples>0&&r(t)===!1){l.__webglMultisampledFramebuffer=e.createFramebuffer(),l.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer);for(let n=0;n<m.length;n++){const s=m[n];l.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,l.__webglColorRenderbuffer[n]);const o=i.convert(s.format,s.colorSpace),a=i.convert(s.type),r=f(s.internalFormat,o,a,s.normalized,s.colorSpace,t.isXRRenderTarget===!0),d=c(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,d,r,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,l.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(l.__webglDepthRenderbuffer=e.createRenderbuffer(),x(l.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(b){n.bindTexture(e.TEXTURE_CUBE_MAP,g.__webglTexture),p(e.TEXTURE_CUBE_MAP,o);for(let n=0;n<6;n++)if(o.mipmaps.length>0)for(let s=0;s<o.mipmaps.length;s++)u(l.__webglFramebuffer[n][s],t,o,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,s);else u(l.__webglFramebuffer[n],t,o,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);d(o)?h(e.TEXTURE_CUBE_MAP):o.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,o.mipmaps.length-1),n.unbindTexture()}else if(v){for(let i=0,r=m.length;i<r;i++){const a=m[i],c=s.get(a);let o=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(o=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(o,c.__webglTexture),p(o,a),u(l.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,o,0),d(a)&&h(o)}n.unbindTexture()}else{let s=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(s=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(s,g.__webglTexture),p(s,o),o.mipmaps.length>0)for(let n=0;n<o.mipmaps.length;n++)u(l.__webglFramebuffer[n],t,o,e.COLOR_ATTACHMENT0,s,n);else u(l.__webglFramebuffer,t,o,e.COLOR_ATTACHMENT0,s,0);d(o)?h(s):o.mipmaps.length>0&&e.texParameteri(s,e.TEXTURE_MAX_LEVEL,o.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&E(t)}function ae(e){const t=e.textures;for(let o=0,a=t.length;o<a;o++){const i=t[o];if(d(i)&&i.mipmapsAutoUpdate===!0){const t=me(e),o=s.get(i).__webglTexture;n.bindTexture(t,o),h(t),n.unbindTexture()}}}const j=[];function ce(t){if(t.samples>0)if(r(t)===!1){const i=t.textures,c=t.width,l=t.height;let a=e.COLOR_BUFFER_BIT;const d=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,o=s.get(t),r=i.length>1;if(r)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,o.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,o.__webglMultisampledFramebuffer);const u=t.texture.mipmaps;u.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,o.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,o.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(a|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(a|=e.STENCIL_BUFFER_BIT)),r){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,o.__webglColorRenderbuffer[n]);const t=s.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,c,l,0,0,c,l,a,e.NEAREST),Y===!0&&(j.length=0,j.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&j.push(d),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,j))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),r)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,o.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,o.__webglColorRenderbuffer[t]);const a=s.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,o.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,o.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&Y){const n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}function c(e){return Math.min(o.maxSamples,e.samples)}function r(e){const n=s.get(e);return e.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&n.__useRenderToTexture!==!1}function ue(e){const t=a.render.frame;k.get(e)!==t&&(k.set(e,t),e.update())}function D(e,t){const n=e.colorSpace,s=e.format,o=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0?t:(n!==LinearSRGBColorSpace&&n!==NoColorSpace&&(ColorManagement.getTransfer(n)===SRGBTransfer?(s!==RGBAFormat||o!==UnsignedByteType)&&warn("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):error("WebGLTextures: Unsupported texture color space:",n)),t)}function _(e){return typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame!="undefined"&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ne,this.resetTextureUnits=re,this.getTextureUnits=G,this.setTextureUnits=se,this.setTexture2D=B,this.setTexture2DArray=ee,this.setTexture3D=Z,this.setTextureCube=W,this.rebindTextures=oe,this.setupRenderTarget=ie,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=ce,this.setupDepthRenderbuffer=E,this.setupFrameBufferTexture=u,this.useMultisampledRTT=r,this.dispose=he}function WebGLUtils(e,t){function n(n,s=NoColorSpace){let o;const i=ColorManagement.getTransfer(s);if(n===UnsignedByteType)return e.UNSIGNED_BYTE;if(n===UnsignedShort4444Type)return e.UNSIGNED_SHORT_4_4_4_4;if(n===UnsignedShort5551Type)return e.UNSIGNED_SHORT_5_5_5_1;if(n===UnsignedInt5999Type)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===UnsignedInt101111Type)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===ByteType)return e.BYTE;if(n===ShortType)return e.SHORT;if(n===UnsignedShortType)return e.UNSIGNED_SHORT;if(n===IntType)return e.INT;if(n===UnsignedIntType)return e.UNSIGNED_INT;if(n===FloatType)return e.FLOAT;if(n===HalfFloatType)return e.HALF_FLOAT;if(n===AlphaFormat)return e.ALPHA;if(n===RGBFormat)return e.RGB;if(n===RGBAFormat)return e.RGBA;if(n===DepthFormat)return e.DEPTH_COMPONENT;if(n===DepthStencilFormat)return e.DEPTH_STENCIL;if(n===RedFormat)return e.RED;if(n===RedIntegerFormat)return e.RED_INTEGER;if(n===RGFormat)return e.RG;if(n===RGIntegerFormat)return e.RG_INTEGER;if(n===RGBAIntegerFormat)return e.RGBA_INTEGER;if(n===RGB_S3TC_DXT1_Format||n===RGBA_S3TC_DXT1_Format||n===RGBA_S3TC_DXT3_Format||n===RGBA_S3TC_DXT5_Format)if(i===SRGBTransfer)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){{if(n===RGB_S3TC_DXT1_Format)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===RGBA_S3TC_DXT1_Format)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===RGBA_S3TC_DXT3_Format)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===RGBA_S3TC_DXT5_Format)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){{if(n===RGB_S3TC_DXT1_Format)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===RGBA_S3TC_DXT1_Format)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===RGBA_S3TC_DXT3_Format)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===RGBA_S3TC_DXT5_Format)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}}else return null;if(n===RGB_PVRTC_4BPPV1_Format||n===RGB_PVRTC_2BPPV1_Format||n===RGBA_PVRTC_4BPPV1_Format||n===RGBA_PVRTC_2BPPV1_Format)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){{if(n===RGB_PVRTC_4BPPV1_Format)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===RGB_PVRTC_2BPPV1_Format)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===RGBA_PVRTC_4BPPV1_Format)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===RGBA_PVRTC_2BPPV1_Format)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}}else return null;if(n===RGB_ETC1_Format||n===RGB_ETC2_Format||n===RGBA_ETC2_EAC_Format||n===R11_EAC_Format||n===SIGNED_R11_EAC_Format||n===RG11_EAC_Format||n===SIGNED_RG11_EAC_Format)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){{if(n===RGB_ETC1_Format||n===RGB_ETC2_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===RGBA_ETC2_EAC_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC;if(n===R11_EAC_Format)return o.COMPRESSED_R11_EAC;if(n===SIGNED_R11_EAC_Format)return o.COMPRESSED_SIGNED_R11_EAC;if(n===RG11_EAC_Format)return o.COMPRESSED_RG11_EAC;if(n===SIGNED_RG11_EAC_Format)return o.COMPRESSED_SIGNED_RG11_EAC}}else return null;if(n===RGBA_ASTC_4x4_Format||n===RGBA_ASTC_5x4_Format||n===RGBA_ASTC_5x5_Format||n===RGBA_ASTC_6x5_Format||n===RGBA_ASTC_6x6_Format||n===RGBA_ASTC_8x5_Format||n===RGBA_ASTC_8x6_Format||n===RGBA_ASTC_8x8_Format||n===RGBA_ASTC_10x5_Format||n===RGBA_ASTC_10x6_Format||n===RGBA_ASTC_10x8_Format||n===RGBA_ASTC_10x10_Format||n===RGBA_ASTC_12x10_Format||n===RGBA_ASTC_12x12_Format)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){{if(n===RGBA_ASTC_4x4_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===RGBA_ASTC_5x4_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===RGBA_ASTC_5x5_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===RGBA_ASTC_6x5_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===RGBA_ASTC_6x6_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===RGBA_ASTC_8x5_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===RGBA_ASTC_8x6_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===RGBA_ASTC_8x8_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===RGBA_ASTC_10x5_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===RGBA_ASTC_10x6_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===RGBA_ASTC_10x8_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===RGBA_ASTC_10x10_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===RGBA_ASTC_12x10_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===RGBA_ASTC_12x12_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}}else return null;if(n===RGBA_BPTC_Format||n===RGB_BPTC_SIGNED_Format||n===RGB_BPTC_UNSIGNED_Format)if(o=t.get("EXT_texture_compression_bptc"),o!==null){{if(n===RGBA_BPTC_Format)return i===SRGBTransfer?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===RGB_BPTC_SIGNED_Format)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===RGB_BPTC_UNSIGNED_Format)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}}else return null;if(n===RED_RGTC1_Format||n===SIGNED_RED_RGTC1_Format||n===RED_GREEN_RGTC2_Format||n===SIGNED_RED_GREEN_RGTC2_Format)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){{if(n===RED_RGTC1_Format)return o.COMPRESSED_RED_RGTC1_EXT;if(n===SIGNED_RED_RGTC1_Format)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===RED_GREEN_RGTC2_Format)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===SIGNED_RED_GREEN_RGTC2_Format)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}}else return null;return n===UnsignedInt248Type?e.UNSIGNED_INT_24_8:e[n]!==0[0]?e[n]:null}return{convert:n}}const _occlusion_vertex=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_occlusion_fragment=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class WebXRDepthSensing{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new ExternalTexture(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ShaderMaterial({vertexShader:_occlusion_vertex,fragmentShader:_occlusion_fragment,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Mesh(new PlaneGeometry(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class WebXRManager extends EventDispatcher{constructor(e,t){super();const h=this;let n=null,A=1,b=null,F="local-floor",O=1,g=null,C=null,d=null,i=null,o=null,E=null;const _=typeof XRWebGLBinding!="undefined",u=new WebXRDepthSensing,v={},c=t.getContextAttributes();let L=null,m=null;const a=[],l=[],x=new Vector2;let N=null,f=null;const p=new PerspectiveCamera;p.viewport=new Vector4;const j=new PerspectiveCamera;j.viewport=new Vector4;const M=[p,j],s=new ArrayCamera;let S=null,w=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=a[e];return t===0[0]&&(t=new WebXRController,a[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=a[e];return t===0[0]&&(t=new WebXRController,a[e]=t),t.getGripSpace()},this.getHand=function(e){let t=a[e];return t===0[0]&&(t=new WebXRController,a[e]=t),t.getHandSpace()};function r(e){const n=l.indexOf(e.inputSource);if(n===-1)return;const t=a[n];t!==0[0]&&(t.update(e.inputSource,e.frame,g||b),t.dispatchEvent({type:e.type,data:e.inputSource}))}function T(){n.removeEventListener("select",r),n.removeEventListener("selectstart",r),n.removeEventListener("selectend",r),n.removeEventListener("squeeze",r),n.removeEventListener("squeezestart",r),n.removeEventListener("squeezeend",r),n.removeEventListener("end",T),n.removeEventListener("inputsourceschange",z);for(let e=0;e<a.length;e++){const t=l[e];if(t===null)continue;l[e]=null,a[e].disconnect(t)}S=null,w=null,u.reset();for(const e in v)delete v[e];if(e.setRenderTarget(L),o=null,i=null,d=null,n=null,m=null,y.stop(),h.isPresenting=!1,e.setPixelRatio(N),e.setSize(x.width,x.height,!1),f!==null){const e=f.camera;e.fov=f.fov,e.zoom=f.zoom,e.updateProjectionMatrix(),f=null}h.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(e){A=e,h.isPresenting===!0&&warn("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(e){F=e,h.isPresenting===!0&&warn("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return g||b},this.setReferenceSpace=function(e){g=e},this.getBaseLayer=function(){return i!==null?i:o},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(n,t)),d},this.getFrame=function(){return E},this.getSession=function(){return n},this.setSession=async function(s){if(n=s,n!==null){L=e.getRenderTarget(),n.addEventListener("select",r),n.addEventListener("selectstart",r),n.addEventListener("selectend",r),n.addEventListener("squeeze",r),n.addEventListener("squeezestart",r),n.addEventListener("squeezeend",r),n.addEventListener("end",T),n.addEventListener("inputsourceschange",z),c.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(x);const s=_&&"createProjectionLayer"in XRWebGLBinding.prototype;if(s){let s=null,o=null,a=null;c.depth&&(a=c.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,s=c.stencil?DepthStencilFormat:DepthFormat,o=c.stencil?UnsignedInt248Type:UnsignedIntType);const r={colorFormat:t.RGBA8,depthFormat:a,scaleFactor:A};d=this.getBinding(),i=d.createProjectionLayer(r),n.updateRenderState({layers:[i]}),e.setPixelRatio(1),e.setSize(i.textureWidth,i.textureHeight,!1),m=new WebGLRenderTarget(i.textureWidth,i.textureHeight,{format:RGBAFormat,type:UnsignedByteType,depthTexture:new DepthTexture(i.textureWidth,i.textureHeight,o,0[0],0[0],0[0],0[0],0[0],0[0],s),stencilBuffer:c.stencil,colorSpace:e.outputColorSpace,samples:c.antialias?4:0,resolveDepthBuffer:i.ignoreDepthValues===!1,resolveStencilBuffer:i.ignoreDepthValues===!1,storeMultisampledDepthBuffer:i.ignoreDepthValues===!1,storeMultisampledStencilBuffer:i.ignoreDepthValues===!1})}else{const s={antialias:c.antialias,alpha:!0,depth:c.depth,stencil:c.stencil,framebufferScaleFactor:A};o=new XRWebGLLayer(n,t,s),n.updateRenderState({baseLayer:o}),e.setPixelRatio(1),e.setSize(o.framebufferWidth,o.framebufferHeight,!1),m=new WebGLRenderTarget(o.framebufferWidth,o.framebufferHeight,{format:RGBAFormat,type:UnsignedByteType,colorSpace:e.outputColorSpace,stencilBuffer:c.stencil,resolveDepthBuffer:o.ignoreDepthValues===!1,resolveStencilBuffer:o.ignoreDepthValues===!1,storeMultisampledDepthBuffer:o.ignoreDepthValues===!1,storeMultisampledStencilBuffer:o.ignoreDepthValues===!1})}m.isXRRenderTarget=!0,this.setFoveation(O),g=null,b=await n.requestReferenceSpace(F),y.setContext(n),y.start(),h.isPresenting=!0,h.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return u.getDepthTexture()};function z(e){for(let t=0;t<e.removed.length;t++){const s=e.removed[t],n=l.indexOf(s);n>=0&&(l[n]=null,a[n].disconnect(s))}for(let s=0;s<e.added.length;s++){const n=e.added[s];let t=l.indexOf(n);if(t===-1){for(let e=0;e<a.length;e++){if(e>=l.length){l.push(n),t=e;break}if(l[e]===null){l[e]=n,t=e;break}}if(t===-1)break}const o=a[t];o&&o.connect(n)}}function D(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(n===null)return;let o=e.near,i=e.far;u.texture!==null&&(u.depthNear>0&&(o=u.depthNear),u.depthFar>0&&(i=u.depthFar)),s.near=j.near=p.near=o,s.far=j.far=p.far=i,(S!==s.near||w!==s.far)&&(n.updateRenderState({depthNear:s.near,depthFar:s.far}),S=s.near,w=s.far),s.layers.mask=e.layers.mask|6,p.layers.mask=s.layers.mask&-5,j.layers.mask=s.layers.mask&-3;const t=e.parent,a=s.cameras;D(s,t);for(let e=0;e<a.length;e++)D(a[e],t);s.projectionMatrix.copy(p.projectionMatrix),s.projectionMatrixInverse.copy(p.projectionMatrixInverse),f===null&&e.isPerspectiveCamera&&(f={camera:e,fov:e.fov,zoom:e.zoom}),R(e,s,t)};function R(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=RAD2DEG*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return s},this.getFoveation=function(){return i===null&&o===null?0[0]:O},this.setFoveation=function(e){O=e,i!==null&&(i.fixedFoveation=e),o!==null&&o.fixedFoveation!==0[0]&&(o.fixedFoveation=e)},this.hasDepthSensing=function(){return u.texture!==null},this.getDepthSensingMesh=function(){return u.getMesh(s)},this.getCameraTexture=function(e){return v[e]};let k=null;function P(t,r){if(C=r.getViewerPose(g||b),E=r,C!==null){const t=C.views;o!==null&&(e.setRenderTargetFramebuffer(m,o.framebuffer),e.setRenderTarget(m));let r=!1;t.length!==s.cameras.length&&(s.cameras.length=0,r=!0);for(let a=0;a<t.length;a++){const l=t[a];let c=null;if(o!==null)c=o.getViewport(l);else{const t=d.getViewSubImage(i,l);c=t.viewport,a===0&&(e.setRenderTargetTextures(m,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(m))}let n=M[a];n===0[0]&&(n=new PerspectiveCamera,n.layers.enable(a),n.viewport=new Vector4,M[a]=n),n.matrix.fromArray(l.transform.matrix),n.matrix.decompose(n.position,n.quaternion,n.scale),n.projectionMatrix.fromArray(l.projectionMatrix),n.projectionMatrixInverse.copy(n.projectionMatrix).invert(),n.viewport.set(c.x,c.y,c.width,c.height),a===0&&(s.matrix.copy(n.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale)),r===!0&&s.cameras.push(n)}const a=n.enabledFeatures,c=a&&a.includes("depth-sensing")&&n.depthUsage=="gpu-optimized";if(c&&_){d=h.getBinding();const e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&u.init(e,n.renderState)}const l=a&&a.includes("camera-access");if(l&&_){e.state.unbindTexture(),d=h.getBinding();for(let n=0;n<t.length;n++){const e=t[n].camera;if(e){let t=v[e];t||(t=new ExternalTexture,v[e]=t);const n=d.getCameraImage(e);t.sourceTexture=n}}}}for(let e=0;e<a.length;e++){const t=l[e],n=a[e];t!==null&&n!==0[0]&&n.update(t,r,g||b)}k&&k(t,r),r.detectedPlanes&&h.dispatchEvent({type:"planesdetected",data:r}),E=null}const y=new WebGLAnimation;y.setAnimationLoop(P),this.setAnimationLoop=function(e){k=e},this.dispose=function(){}}}const _m1=new Matrix4,_m=new Matrix3;_m.set(-1,0,0,0,1,0,0,0,1);function WebGLMaterials(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function c(t,n){n.color.getRGB(t.fogColor.value,getUnlitUniformColorSpace(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,i,c){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?s(e,t):t.isMeshLambertMaterial?(s(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(s(e,t),u(e,t)):t.isMeshPhongMaterial?(s(e,t),d(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(s(e,t),h(e,t),t.isMeshPhysicalMaterial&&m(e,t,c)):t.isMeshMatcapMaterial?(s(e,t),f(e,t)):t.isMeshDepthMaterial?s(e,t):t.isMeshDistanceMaterial?(s(e,t),p(e,t)):t.isMeshNormalMaterial?s(e,t):t.isLineBasicMaterial?(a(e,t),t.isLineDashedMaterial&&r(e,t)):t.isPointsMaterial?o(e,t,n,i):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function s(e,s){e.opacity.value=s.opacity,s.color&&e.diffuse.value.copy(s.color),s.emissive&&e.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(e.map.value=s.map,n(s.map,e.mapTransform)),s.alphaMap&&(e.alphaMap.value=s.alphaMap,n(s.alphaMap,e.alphaMapTransform)),s.bumpMap&&(e.bumpMap.value=s.bumpMap,n(s.bumpMap,e.bumpMapTransform),e.bumpScale.value=s.bumpScale,s.side===BackSide&&(e.bumpScale.value*=-1)),s.normalMap&&(e.normalMap.value=s.normalMap,n(s.normalMap,e.normalMapTransform),e.normalScale.value.copy(s.normalScale),s.side===BackSide&&e.normalScale.value.negate()),s.displacementMap&&(e.displacementMap.value=s.displacementMap,n(s.displacementMap,e.displacementMapTransform),e.displacementScale.value=s.displacementScale,e.displacementBias.value=s.displacementBias),s.emissiveMap&&(e.emissiveMap.value=s.emissiveMap,n(s.emissiveMap,e.emissiveMapTransform)),s.specularMap&&(e.specularMap.value=s.specularMap,n(s.specularMap,e.specularMapTransform)),s.alphaTest>0&&(e.alphaTest.value=s.alphaTest);const i=t.get(s),o=i.envMap,a=i.envMapRotation;o&&(e.envMap.value=o,e.envMapRotation.value.setFromMatrix4(_m1.makeRotationFromEuler(a)).transpose(),o.isCubeTexture&&o.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(_m),e.reflectivity.value=s.reflectivity,e.ior.value=s.ior,e.refractionRatio.value=s.refractionRatio),s.lightMap&&(e.lightMap.value=s.lightMap,e.lightMapIntensity.value=s.lightMapIntensity,n(s.lightMap,e.lightMapTransform)),s.aoMap&&(e.aoMap.value=s.aoMap,e.aoMapIntensity.value=s.aoMapIntensity,n(s.aoMap,e.aoMapTransform))}function a(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function r(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function o(e,t,s,o){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*s,e.scale.value=o*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function d(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function u(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function h(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function m(e,t,s){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===BackSide&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=s.texture,e.transmissionSamplerSize.value.set(s.width,s.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function f(e,t){t.matcap&&(e.matcap.value=t.matcap)}function p(e,n){const s=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(s.matrixWorld),e.nearDistance.value=s.shadow.camera.near,e.farDistance.value=s.shadow.camera.far}return{refreshFogUniforms:c,refreshMaterialUniforms:i}}function WebGLUniformsGroups(e,t,n,s){let o={},i={};function p(e,t){const n=t.program;s.uniformBlockBinding(e,n,o[e.id])}function u(e,n){let a=o[e.id];a===0[0]&&(g(e),a=h(e),o[e.id]=a,e.addEventListener("dispose",d));const c=n.program;s.updateUBOMapping(e,c);const r=t.render.frame;i[e.id]!==r&&(m(e),i[e.id]=r)}function h(t){const n=e.createBuffer(),s=t.__size,o=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,s,o),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function m(t){const i=o[t.id],n=t.uniforms,s=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,i);for(let e=0,o=n.length;e<o;e++){const t=n[e];if(Array.isArray(t))for(let n=0,o=t.length;n<o;n++)r(t[n],e,n,s);else r(t,e,0,s)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function r(t,n,s,o){if(f(t,n,s,o)===!0){const s=t.__offset,n=t.value;if(Array.isArray(n)){let e=0;for(let s=0;s<n.length;s++){const o=n[s],i=l(o,!0);c(o,t.__data,e),e+=i.storage/Float32Array.BYTES_PER_ELEMENT}}else c(n,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,s,t.__data)}}function c(e,t,n){typeof e=="number"||typeof e=="boolean"?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,s){const o=e.value,i=t+"_"+n;if(Array.isArray(o)){s[i]===0[0]&&(s[i]=[]);const t=s[i];let e=!1;for(let n=0;n<o.length;n++)a(o[n],t,n)===!0&&(e=!0);return e}return a(o,s,i)}function a(e,t,n){if(t[n]===0[0])return typeof e=="number"||typeof e=="boolean"?t[n]=e:ArrayBuffer.isView(e)?t[n]=e.slice():t[n]=e.clone(),!0;const s=t[n];if(typeof e=="number"||typeof e=="boolean"){if(s!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(s.equals(e)===!1)return s.copy(e),!0;return!1}function g(e){const n=e.uniforms;let t=0;const s=16;for(let e=0,i=n.length;e<i;e++){const o=Array.isArray(n[e])?n[e]:[n[e]];for(let a=0,d=o.length;a<d;a++){const i=o[a],c=Array.isArray(i.value)?i.value:[i.value],u=Array.isArray(n[e])||Array.isArray(i.value);let r=t;for(let e=0,d=c.length;e<d;e++){const h=c[e],n=l(h,u),i=t%s,a=i%n.boundary,o=i+a;t+=a,o!==0&&s-o<n.storage&&(t+=s-o),e===0&&(r=t),t+=n.storage}const h=i.type==="int"?Int32Array:i.type==="uint"?Uint32Array:Float32Array;i.__data=new h((t-r)/Float32Array.BYTES_PER_ELEMENT),i.__offset=r}}const o=t%s;return o>0&&(t+=s-o),e.__size=t,e.__cache={},this}function l(e,t){const n={boundary:0,storage:0};return typeof e=="number"||typeof e=="boolean"?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?warn("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):warn("WebGLRenderer: Unsupported uniform value type.",e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function d(t){const n=t.target;n.removeEventListener("dispose",d),e.deleteBuffer(o[n.id]),delete o[n.id],delete i[n.id]}function v(){for(const t in o)e.deleteBuffer(o[t]);o={},i={}}return{bind:p,update:u,dispose:v}}const DATA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let lut=null;function getDFGLUT(){return lut===null&&(lut=new DataTexture(DATA,16,16,RGFormat,HalfFloatType),lut.name="DFG_LUT",lut.minFilter=LinearFilter,lut.magFilter=LinearFilter,lut.wrapS=ClampToEdgeWrapping,lut.wrapT=ClampToEdgeWrapping,lut.generateMipmaps=!1,lut.needsUpdate=!0),lut}class WebGLRenderer{constructor(e={}){const{canvas:r=createCanvasElement(),context:Q=null,depth:we=!0,stencil:ie=!1,alpha:$e=!1,antialias:Fe=!1,premultipliedAlpha:ve=!0,preserveDrawingBuffer:qe=!1,powerPreference:Be="default",failIfMajorPerformanceCaveat:Ge=!1,reversedDepthBuffer:Xe=!1,outputBufferType:Ze=UnsignedByteType}=e;this.isWebGLRenderer=!0;let me;if(Q!==null){if(typeof WebGLRenderingContext!="undefined"&&Q instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");me=Q.getContextAttributes().alpha}else me=$e;const pe=Ze,Ye=new Set([RGBAIntegerFormat,RGIntegerFormat,RedIntegerFormat]),st=new Set([UnsignedByteType,UnsignedIntType,UnsignedShortType,UnsignedInt248Type,UnsignedShort4444Type,UnsignedShort5551Type]),I=new Uint32Array(4),H=new Int32Array(4),Je={textures:[],min:[],max:[],resolution:[]};let h=null,i=null;const z=[],x=[];let j=null;this.domElement=r,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=NoToneMapping,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const s=this;let fe=!1,l=null,ye=null,Te=null,ze=null;this._outputColorSpace=SRGBColorSpace;let de=0,K=0,c=null,D=-1,N=null;const w=new Vector4,F=new Vector4;let V=null;const De=new Color(0);let ce=0,k=r.width,C=r.height,v=1,He=null,Ae=null;const R=new Vector4(0,0,k,C),P=new Vector4(0,0,k,C);let oe=!1;const se=new Frustum,ne=new FrustumArray;let y=!1,B=!1;const J=new Matrix4,Ve=new Vector3,A=new Vector4,ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let W=!1;function Y(){return c===null?v:1}let t=Q;function Ie(e,t){return r.getContext(e,t)}let u,p,n,b,o,a,T,M,Z,L,_,te,U,X,m,f,g,xe,Ce,Ee,O,E,G;try{const e={alpha:!0,depth:we,stencil:ie,antialias:Fe,premultipliedAlpha:ve,preserveDrawingBuffer:qe,powerPreference:Be,failIfMajorPerformanceCaveat:Ge};if("setAttribute"in r&&r.setAttribute("data-engine",`three.js r${REVISION}`),r.addEventListener("webglcontextlost",he,!1),r.addEventListener("webglcontextrestored",ue,!1),r.addEventListener("webglcontextcreationerror",le,!1),t===null){const n="webgl2";if(t=Ie(n,e),t===null)throw Ie(n)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Me()}catch(e){throw r.removeEventListener("webglcontextlost",he,!1),r.removeEventListener("webglcontextrestored",ue,!1),r.removeEventListener("webglcontextcreationerror",le,!1),error("WebGLRenderer: "+e.message),e}function Me(){u=new WebGLExtensions(t),u.init(),O=new WebGLUtils(t,u),p=new WebGLCapabilities(t,u,e,O),n=new WebGLState(t,u),p.reversedDepthBuffer&&Xe&&n.buffers.depth.setReversed(!0),ye=t.createFramebuffer(),Te=t.createFramebuffer(),ze=t.createFramebuffer(),b=new WebGLInfo(t),o=new WebGLProperties,a=new WebGLTextures(t,u,n,o,p,O,b),T=new WebGLEnvironments(s),M=new WebGLAttributes(t),E=new WebGLBindingStates(t,M),Z=new WebGLGeometries(t,M,b,E),L=new WebGLObjects(t,Z,M,E,b),xe=new WebGLMorphtargets(t,p,a),m=new WebGLClipping(o),_=new WebGLPrograms(s,T,u,p,E,m),te=new WebGLMaterials(s,o),U=new WebGLRenderLists,X=new WebGLRenderStates(u),g=new WebGLBackground(s,T,n,L,me,ve),f=new WebGLShadowMap(s,L,p),G=new WebGLUniformsGroups(t,b,p,n),Ce=new WebGLBufferRenderer(t,u,b),Ee=new WebGLIndexedBufferRenderer(t,u,b),b.programs=_.programs,s.capabilities=p,s.extensions=u,s.properties=o,s.renderLists=U,s.shadowMap=f,s.state=n,s.info=b}pe!==UnsignedByteType&&(j=new WebGLOutput(pe,r.width,r.height,Fe,we,ie));const d=new WebXRManager(s,t);this.xr=d,this.getContext=function(){return t},this.getContextAttributes=function(){return t.getContextAttributes()},this.forceContextLoss=function(){const e=u.get("WEBGL_lose_context");e&&e.loseContext()},this.forceContextRestore=function(){const e=u.get("WEBGL_lose_context");e&&e.restoreContext()},this.getPixelRatio=function(){return v},this.setPixelRatio=function(e){if(e===0[0])return;v=e,this.setSize(k,C,!1)},this.getSize=function(e){return e.set(k,C)},this.setSize=function(e,t,n=!0){if(d.isPresenting){warn("WebGLRenderer: Can't change size while VR device is presenting.");return}k=e,C=t,r.width=Math.floor(e*v),r.height=Math.floor(t*v),n===!0&&(r.style.width=e+"px",r.style.height=t+"px"),j!==null&&j.setSize(r.width,r.height),this.setViewport(0,0,e,t)},this.getDrawingBufferSize=function(e){return e.set(k*v,C*v).floor()},this.setDrawingBufferSize=function(e,t,n){k=e,C=t,v=n,r.width=Math.floor(e*n),r.height=Math.floor(t*n),this.setViewport(0,0,e,t)},this.setEffects=function(e){if(pe===UnsignedByteType){error("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(e)for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){warn("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}j.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(w)},this.getViewport=function(e){return e.copy(R)},this.setViewport=function(e,t,s,o){e.isVector4?R.set(e.x,e.y,e.z,e.w):R.set(e,t,s,o),n.viewport(w.copy(R).multiplyScalar(Y()).round())},this.getScissor=function(e){return e.copy(P)},this.setScissor=function(e,t,s,o){e.isVector4?P.set(e.x,e.y,e.z,e.w):P.set(e,t,s,o),n.scissor(F.copy(P).multiplyScalar(Y()).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(e){n.setScissorTest(oe=e)},this.setOpaqueSort=function(e){He=e},this.setTransparentSort=function(e){Ae=e},this.getClearColor=function(e){return e.copy(g.getClearColor())},this.setClearColor=function(){g.setClearColor(...arguments)},this.getClearAlpha=function(){return g.getClearAlpha()},this.setClearAlpha=function(){g.setClearAlpha(...arguments)},this.clear=function(e=!0,n=!0,s=!0){let o=0;if(e){let e=!1;if(c!==null){const t=c.texture.format;e=Ye.has(t)}if(e){const a=c.texture.type,r=st.has(a),e=g.getClearColor(),n=g.getClearAlpha(),s=e.r,o=e.g,i=e.b;r?(I[0]=s,I[1]=o,I[2]=i,I[3]=n,t.clearBufferuiv(t.COLOR,0,I)):(H[0]=s,H[1]=o,H[2]=i,H[3]=n,t.clearBufferiv(t.COLOR,0,H))}else o|=t.COLOR_BUFFER_BIT}n&&(o|=t.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),s&&(o|=t.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),o!==0&&t.clear(o)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),l=e},this.dispose=function(){r.removeEventListener("webglcontextlost",he,!1),r.removeEventListener("webglcontextrestored",ue,!1),r.removeEventListener("webglcontextcreationerror",le,!1),g.dispose(),U.dispose(),X.dispose(),a.dispose(),o.dispose(),T.dispose(),L.dispose(),Z.dispose(),E.dispose(),G.dispose(),_.dispose(),d.dispose(),d.removeEventListener("sessionstart",Se),d.removeEventListener("sessionend",ge),S.stop()};function he(e){e.preventDefault(),log("WebGLRenderer: Context Lost."),fe=!0}function ue(){log("WebGLRenderer: Context Restored."),fe=!1;const e=b.autoReset,t=f.enabled,n=f.autoUpdate,s=f.needsUpdate,o=f.type;Me(),b.autoReset=e,f.enabled=t,f.autoUpdate=n,f.needsUpdate=s,f.type=o}function le(e){error("WebGLRenderer: A WebGL context could not be created. Reason: ",e.statusMessage)}function Ne(e){const t=e.target;t.removeEventListener("dispose",Ne),Ke(t)}function Ke(e){Ue(e),o.remove(e)}function Ue(e){const t=o.get(e).programs;t!==0[0]&&(t.forEach(function(e){_.releaseProgram(e)}),e.isShaderMaterial&&_.releaseShaderCache(e))}this.renderBufferDirect=function(e,s,i,a,r,c){s===null&&(s=ee);const j=r.isMesh&&r.matrixWorld.determinantAffine()<0,y=et(e,s,i,a,r);n.setMaterial(a,j);let h=i.index,f=1;if(a.wireframe===!0){if(h=Z.getWireframeAttribute(i),h===0[0])return;f=2}const g=i.drawRange,v=i.attributes.position;let d=g.start*f,m=(g.start+g.count)*f;c!==null&&(d=Math.max(d,c.start*f),m=Math.min(m,(c.start+c.count)*f)),h!==null?(d=Math.max(d,0),m=Math.min(m,h.count)):v!=null&&(d=Math.max(d,0),m=Math.min(m,v.count));const p=m-d;if(p<0||p===1/0)return;E.setup(r,a,y,i,h);let b,l=Ce;if(h!==null&&(b=M.get(h),l=Ee,l.setIndex(b)),r.isMesh)a.wireframe===!0?(n.setLineWidth(a.wireframeLinewidth*Y()),l.setMode(t.LINES)):l.setMode(t.TRIANGLES);else if(r.isLine){let e=a.linewidth;e===0[0]&&(e=1),n.setLineWidth(e*Y()),r.isLineSegments?l.setMode(t.LINES):r.isLineLoop?l.setMode(t.LINE_LOOP):l.setMode(t.LINE_STRIP)}else r.isPoints?l.setMode(t.POINTS):r.isSprite&&l.setMode(t.TRIANGLES);if(r.isBatchedMesh)if(u.get("WEBGL_multi_draw"))l.renderMultiDraw(r._multiDrawStarts,r._multiDrawCounts,r._multiDrawCount);else{const e=r._multiDrawStarts,n=r._multiDrawCounts,s=r._multiDrawCount,i=h?M.get(h).bytesPerElement:1,c=o.get(a).currentProgram.getUniforms();for(let o=0;o<s;o++)c.setValue(t,"_gl_DrawID",o),l.render(e[o]/i,n[o])}else if(r.isInstancedMesh)l.renderInstances(d,p,r.count);else if(i.isInstancedBufferGeometry){const e=i._maxInstanceCount!==0[0]?i._maxInstanceCount:1/0,t=Math.min(i.instanceCount,e);l.renderInstances(d,p,t)}else l.render(d,p)};function Pe(e,t,n,s){l!==null&&e.isNodeMaterial&&l.setObject(s,e),y===!0&&m.setState(e,n,!1),e.transparent===!0&&e.side===DoubleSide&&e.forceSinglePass===!1?(e.side=BackSide,e.needsUpdate=!0,$(e,t,s),e.side=FrontSide,e.needsUpdate=!0,$(e,t,s),e.side=DoubleSide):$(e,t,s)}this.compile=function(e,t,n=null){n===null&&(n=e),l!==null&&l.renderStart(e,t,n),i=X.get(n),i.init(t),x.push(i),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(i.pushLight(e),e.castShadow&&i.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(i.pushLight(e),e.castShadow&&i.pushShadow(e))}),i.setupLights(),l!==null&&l.updateLights(i.state.lightsArray),B=this.localClippingEnabled,y=m.init(this.clippingPlanes,B),y===!0&&m.setGlobalState(this.clippingPlanes,t),l!==null&&f.render(i.state.shadowsArray,n,t);const s=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;const o=e.material;if(o)if(Array.isArray(o))for(let i=0;i<o.length;i++){const a=o[i];Pe(a,n,t,e),s.add(a)}else Pe(o,n,t,e),s.add(o)}),i=x.pop(),l!==null&&l.renderEnd(),s},this.compileAsync=function(e,t,n=null){const s=this.compile(e,t,n);return new Promise(t=>{function n(){if(s.forEach(function(e){const n=o.get(e),t=n.currentProgram;(t===0[0]||t.isReady())&&s.delete(e)}),s.size===0){t(e);return}setTimeout(n,10)}u.get("KHR_parallel_shader_compile")!==null?n():setTimeout(n,10)})};let re=null;function We(e){re&&re(e)}function Se(){S.stop()}function ge(){S.start()}const S=new WebGLAnimation;S.setAnimationLoop(We),typeof self!="undefined"&&S.setContext(self),this.setAnimationLoop=function(e){re=e,d.setAnimationLoop(e),e===null?S.stop():S.start()},d.addEventListener("sessionstart",Se),d.addEventListener("sessionend",ge),this.render=function(e,t){if(t!==0[0]&&t.isCamera!==!0){error("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(fe===!0)return;l!==null&&l.renderStart(e,t);const o=d.enabled===!0&&d.isPresenting===!0,n=j!==null&&(c===null||o)&&j.begin(s,c);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),d.enabled===!0&&d.isPresenting===!0&&(j===null||j.isCompositing()===!1)&&(d.cameraAutoUpdate===!0&&d.updateCamera(t),t=d.getCamera()),e.isScene===!0&&e.onBeforeRender(s,e,t,c),i=X.get(e,x.length),i.init(t),i.state.textureUnits=a.getTextureUnits(),x.push(i),J.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?ne.setFromArrayCamera(t):se.setFromProjectionMatrix(J,WebGLCoordinateSystem,t.reversedDepth),B=this.localClippingEnabled,y=m.init(this.clippingPlanes,B),h=U.get(e,z.length),h.init(),z.push(h),this.info.render.frame++,d.enabled===!0&&d.isPresenting===!0){const e=s.xr.getDepthSensingMesh();e!==null&&ae(e,t,-(1/0),s.sortObjects)}ae(e,t,0,s.sortObjects),h.finish(),l!==null&&l.updateLights(i.state.lightsArray),s.sortObjects===!0&&h.sort(He,Ae),W=d.enabled===!1||d.isPresenting===!1||d.hasDepthSensing()===!1,W&&g.addToRenderList(h,e),this.info.autoReset===!0&&this.info.reset(),y===!0&&m.beginShadows();const r=i.state.shadowsArray;f.render(r,e,t),y===!0&&m.endShadows();const u=n&&j.hasRenderPass();if(u===!1){const s=h.opaque,n=h.transmissive;if(i.setupLights(),t.isArrayCamera){const o=t.cameras;if(n.length>0)for(let t=0,i=o.length;t<i;t++){const a=o[t];Le(s,n,e,a)}W&&g.render(e);for(let t=0,s=o.length;t<s;t++){const n=o[t];Re(h,e,n,n.viewport)}}else n.length>0&&Le(s,n,e,t),W&&g.render(e),Re(h,e,t)}c!==null&&K===0&&(a.updateMultisampleRenderTarget(c),a.updateRenderTargetMipmap(c)),n&&j.end(s),e.isScene===!0&&e.onAfterRender(s,e,t),E.resetDefaultState(),D=-1,N=null,x.pop(),x.length>0?(i=x[x.length-1],a.setTextureUnits(i.state.textureUnits),y===!0&&m.setGlobalState(s.clippingPlanes,i.state.camera)):i=null,z.pop(),z.length>0?h=z[z.length-1]:h=null,l!==null&&l.renderEnd()};function ae(e,t,n,s){if(e.visible===!1)return;const a=e.layers.test(t.layers);if(a)if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)i.pushLight(e),e.castShadow&&i.pushShadow(e);else if(e.isSprite){{const o=t.isArrayCamera?ne:se;if(!e.frustumCulled||e.intersectsFrustum(o)){s&&A.setFromMatrixPosition(e.matrixWorld).applyMatrix4(J);const i=L.update(e),o=e.material;o.visible&&h.push(e,i,o,n,A.z,null,t)}}}else if(e.isMesh||e.isLine||e.isPoints){const o=t.isArrayCamera?ne:se;if(!e.frustumCulled||e.intersectsFrustum(o)){const o=L.update(e),i=e.material;if(s&&(e.boundingSphere!==0[0]?(e.boundingSphere===null&&e.computeBoundingSphere(),A.copy(e.boundingSphere.center)):(o.boundingSphere===null&&o.computeBoundingSphere(),A.copy(o.boundingSphere.center)),A.applyMatrix4(e.matrixWorld).applyMatrix4(J)),Array.isArray(i)){const s=o.groups;for(let a=0,l=s.length;a<l;a++){const c=s[a],r=i[c.materialIndex];r&&r.visible&&h.push(e,o,r,n,A.z,c,t)}}else i.visible&&h.push(e,o,i,n,A.z,null,t)}}const o=e.children;for(let e=0,i=o.length;e<i;e++)ae(o[e],t,n,s)}function Re(e,t,o,a){const{opaque:r,transmissive:c,transparent:l}=e;i.setupLightsView(o),y===!0&&m.setGlobalState(s.clippingPlanes,o),a&&n.viewport(w.copy(a)),r.length>0&&q(r,t,o),c.length>0&&q(c,t,o),l.length>0&&q(l,t,o),n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),n.setPolygonOffset(!1)}function Le(e,t,n,o){const d=n.isScene===!0?n.overrideMaterial:null;if(d!==null)return;if(i.state.transmissionRenderTarget[o.id]===0[0]){const e=u.has("EXT_color_buffer_half_float")||u.has("EXT_color_buffer_float");i.state.transmissionRenderTarget[o.id]=new WebGLRenderTarget(1,1,{generateMipmaps:!0,type:e?HalfFloatType:UnsignedByteType,minFilter:LinearMipmapLinearFilter,samples:Math.max(4,p.samples),stencilBuffer:ie,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ColorManagement.workingColorSpace})}const r=i.state.transmissionRenderTarget[o.id],c=o.viewport||w;r.setSize(c.z*s.transmissionResolutionScale,c.w*s.transmissionResolutionScale);const h=s.getRenderTarget(),f=s.getActiveCubeFace(),v=s.getActiveMipmapLevel();s.setRenderTarget(r),s.getClearColor(De),ce=s.getClearAlpha(),ce<1&&s.setClearColor(16777215,.5),s.clear(),W&&g.render(n);const b=s.toneMapping;s.toneMapping=NoToneMapping;const l=o.viewport;if(o.viewport!==0[0]&&(o.viewport=0[0]),i.setupLightsView(o),y===!0&&m.setGlobalState(s.clippingPlanes,o),q(e,n,o),a.updateMultisampleRenderTarget(r),a.updateRenderTargetMipmap(r),u.has("WEBGL_multisampled_render_to_texture")===!1){let e=!1;for(let i=0,r=t.length;i<r;i++){const c=t[i],{object:a,geometry:l,material:s,group:d}=c;if(s.side===DoubleSide&&a.layers.test(o.layers)){const t=s.side;s.side=BackSide,s.needsUpdate=!0,ke(a,n,o,l,s,d),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(a.updateMultisampleRenderTarget(r),a.updateRenderTargetMipmap(r))}s.setRenderTarget(h,f,v),s.setClearColor(De,ce),l!==0[0]&&(o.viewport=l),s.toneMapping=b}function q(e,t,n){const s=t.isScene===!0?t.overrideMaterial:null;for(let o=0,c=e.length;o<c;o++){const a=e[o],{object:r,geometry:l,group:d}=a;let i=a.material;i.allowOverride===!0&&s!==null&&(i=s),r.layers.test(n.layers)&&ke(r,t,n,l,i,d)}}function ke(e,t,n,o,i,a){l!==null&&i.isNodeMaterial&&l.setObject(e,i),e.onBeforeRender(s,t,n,o,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(s,t,n,o,e,a),i.transparent===!0&&i.side===DoubleSide&&i.forceSinglePass===!1?(i.side=BackSide,i.needsUpdate=!0,s.renderBufferDirect(n,t,o,i,e,a),i.side=FrontSide,i.needsUpdate=!0,s.renderBufferDirect(n,t,o,i,e,a),i.side=DoubleSide):s.renderBufferDirect(n,t,o,i,e,a),e.onAfterRender(s,t,n,o,i,a)}function Oe(e){let t=0;for(const n of e)n.texture!==null&&t++;return t}function $(e,t,n){t.isScene!==!0&&(t=ee);const c=o.get(e),a=i.state.lights,g=i.state.shadowsArray,p=a.state.version,d=_.getParameters(e,a.state,g,t,n,i.state.lightProbeGridArray),f=_.getProgramCacheKey(d);let h=c.programs;c.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,c.fog=t.fog;const v=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;c.envMap=T.get(e.envMap||c.environment,v),c.envMapRotation=c.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,h===0[0]&&(e.addEventListener("dispose",Ne),h=new Map,c.programs=h,c.programVariants=new Map);let u=h.get(f);if(u!==0[0]){if(c.currentProgram===u&&c.lightsStateVersion===p)return je(e,d),u}else d.uniforms=_.getUniforms(e),l!==null&&e.isNodeMaterial&&l.build(e,n,d),e.onBeforeCompile(d,s),u=_.acquireProgram(d,f),h.set(f,u),c.uniforms=d.uniforms;const r=c.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(r.clippingPlanes=m.uniform),je(e,d),c.needsLights=nt(e),c.lightsStateVersion=p,c.needsLights&&(r.ambientLightColor.value=a.state.ambient,r.lightProbe.value=a.state.probe,r.sunLights.value=a.state.sun,r.sunLightShadows.value=a.state.sunShadow,r.directionalLights.value=a.state.directional,r.directionalLightShadows.value=a.state.directionalShadow,r.spotLights.value=a.state.spot,r.spotLightShadows.value=a.state.spotShadow,r.rectAreaLights.value=a.state.rectArea,r.ltc_1.value=a.state.rectAreaLTC1,r.ltc_2.value=a.state.rectAreaLTC2,r.pointLights.value=a.state.point,r.pointLightShadows.value=a.state.pointShadow,r.hemisphereLights.value=a.state.hemi,r.sunShadowMatrix.value=a.state.sunShadowMatrix,r.sunShadowCascade.value=a.state.sunShadowCascade,r.directionalShadowMatrix.value=a.state.directionalShadowMatrix,r.spotLightMatrix.value=a.state.spotLightMatrix,r.spotLightMap.value=a.state.spotLightMap,r.pointShadowMatrix.value=a.state.pointShadowMatrix),c.numLightProbeGrids=Oe(i.state.lightProbeGridArray),c.currentProgram=u,c.uniformsList=null,u}function Qe(e,t,n,s,i){const a=o.get(e),c=a.currentProgram.id+","+s+","+i;let r=a.programVariants.get(c);return r===0[0]?(r=$(e,t,n),a.programVariants.set(c,r)):(a.currentProgram=r,a.uniformsList=null,a.outputColorSpace=s,a.toneMapping=i),r}function _e(e){if(e.uniformsList===null){const t=e.currentProgram.getUniforms();e.uniformsList=WebGLUniforms.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function je(e,t){const n=o.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function et(e,r,d,u,h){r.isScene!==!0&&(r=ee),a.resetTextureUnits();const x=r.fog,K=u.isMeshStandardMaterial||u.isMeshLambertMaterial||u.isMeshPhongMaterial?r.environment:null,z=c===null?s.outputColorSpace:c.isXRRenderTarget===!0?c.texture.colorSpace:ColorManagement.workingColorSpace,U=u.isMeshStandardMaterial||u.isMeshLambertMaterial&&!u.envMap||u.isMeshPhongMaterial&&!u.envMap,W=T.get(u.envMap||K,U),V=u.vertexColors===!0&&!!d.attributes.color&&d.attributes.color.itemSize===4,L=!!d.attributes.tangent&&(!!u.normalMap||u.anisotropy>0),I=!!d.morphAttributes.position,H=!!d.morphAttributes.normal,P=!!d.morphAttributes.color;let k=NoToneMapping;u.toneMapped&&(c===null||c.isXRRenderTarget===!0)&&(k=s.toneMapping);const F=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,R=F!==0[0]?F.length:0,f=o.get(u),_=i.state.lights;if(y===!0&&(B===!0||e!==N)){const t=e===N&&u.id===D;m.setState(u,e,t)}let g=!1,A=!1;u.version===f.__version?f.needsLights&&f.lightsStateVersion!==_.state.version?g=!0:h.isBatchedMesh&&f.batching===!1?g=!0:!h.isBatchedMesh&&f.batching===!0?g=!0:h.isBatchedMesh&&f.batchingColor===!0&&h._colorsTexture===null?g=!0:h.isBatchedMesh&&f.batchingColor===!1&&h._colorsTexture!==null?g=!0:h.isInstancedMesh&&f.instancing===!1?g=!0:!h.isInstancedMesh&&f.instancing===!0?g=!0:h.isSkinnedMesh&&f.skinning===!1?g=!0:!h.isSkinnedMesh&&f.skinning===!0?g=!0:h.isInstancedMesh&&f.instancingColor===!0&&h.instanceColor===null?g=!0:h.isInstancedMesh&&f.instancingColor===!1&&h.instanceColor!==null?g=!0:h.isInstancedMesh&&f.instancingMorph===!0&&h.morphTexture===null?g=!0:h.isInstancedMesh&&f.instancingMorph===!1&&h.morphTexture!==null?g=!0:f.envMap!==W?g=!0:u.fog===!0&&f.fog!==x?g=!0:f.numClippingPlanes!==0[0]&&(f.numClippingPlanes!==m.numPlanes||f.numIntersection!==m.numIntersection)?g=!0:f.vertexAlphas!==V?g=!0:f.vertexTangents!==L?g=!0:f.morphTargets!==I?g=!0:f.morphNormals!==H?g=!0:f.morphColors!==P?g=!0:f.morphTargetsCount!==R?g=!0:f.numLightProbeGrids!==Oe(i.state.lightProbeGridArray)?g=!0:(f.outputColorSpace!==z||f.toneMapping!==k)&&(A=!0):(g=!0,f.__version=u.version);let w=f.currentProgram;(g===!0||A===!0)&&(w=A===!0?Qe(u,r,h,z,k):$(u,r,h),l&&u.isNodeMaterial&&l.onUpdateProgram(u,w,f));let M=!1,O=!1,E=!1;const b=w.getUniforms(),j=f.uniforms;if(n.useProgram(w.program)&&(M=!0,O=!0,E=!0),u.id!==D&&(D=u.id,O=!0),M||N!==e){const o=n.buffers.depth.getReversed();o&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),b.setValue(t,"projectionMatrix",e.projectionMatrix),b.setValue(t,"viewMatrix",e.matrixWorldInverse);const s=b.map.cameraPosition;s!==0[0]&&s.setValue(t,Ve.setFromMatrixPosition(e.matrixWorld)),p.logarithmicDepthBuffer&&b.setValue(t,"logDepthBufFC",2/(Math.log(e.far+1)/Math.LN2)),(u.isMeshPhongMaterial||u.isMeshToonMaterial||u.isMeshLambertMaterial||u.isMeshBasicMaterial||u.isMeshStandardMaterial||u.isShaderMaterial)&&b.setValue(t,"isOrthographic",e.isOrthographicCamera===!0),N!==e&&(N=e,O=!0,E=!0)}if(f.needsLights&&(_.state.sunShadowMap.length>0&&b.setValue(t,"sunShadowMap",_.state.sunShadowMap,a),_.state.directionalShadowMap.length>0&&b.setValue(t,"directionalShadowMap",_.state.directionalShadowMap,a),_.state.spotShadowMap.length>0&&b.setValue(t,"spotShadowMap",_.state.spotShadowMap,a),_.state.pointShadowMap.length>0&&b.setValue(t,"pointShadowMap",_.state.pointShadowMap,a)),h.isSkinnedMesh){b.setOptional(t,h,"bindMatrix"),b.setOptional(t,h,"bindMatrixInverse");const e=h.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),b.setValue(t,"boneTexture",e.boneTexture,a))}h.isBatchedMesh&&(b.setOptional(t,h,"batchingTexture"),b.setValue(t,"batchingTexture",h._matricesTexture,a),b.setOptional(t,h,"batchingIdTexture"),b.setValue(t,"batchingIdTexture",h._indirectTexture,a),b.setOptional(t,h,"batchingColorTexture"),h._colorsTexture!==null&&b.setValue(t,"batchingColorTexture",h._colorsTexture,a));const S=d.morphAttributes;if((S.position!==0[0]||S.normal!==0[0]||S.color!==0[0])&&xe.update(h,d,w),(O||f.receiveShadow!==h.receiveShadow)&&(f.receiveShadow=h.receiveShadow,b.setValue(t,"receiveShadow",h.receiveShadow)),(u.isMeshStandardMaterial||u.isMeshLambertMaterial||u.isMeshPhongMaterial)&&u.envMap===null&&r.environment!==null&&(j.envMapIntensity.value=r.environmentIntensity),j.dfgLUT!==0[0]&&(j.dfgLUT.value=getDFGLUT()),O){if(b.setValue(t,"toneMappingExposure",s.toneMappingExposure),f.needsLights&&tt(j,E),x&&u.fog===!0&&te.refreshFogUniforms(j,x),te.refreshMaterialUniforms(j,u,v,C,i.state.transmissionRenderTarget[e.id]),f.needsLights&&f.numLightProbeGrids>0){const e=Je;let t=0;for(const n of i.state.lightProbeGridArray){if(n.texture===null)continue;e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++}for(const n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}WebGLUniforms.upload(t,_e(f),j,a)}if(u.isShaderMaterial&&u.uniformsNeedUpdate===!0&&(WebGLUniforms.upload(t,_e(f),j,a),u.uniformsNeedUpdate=!1),u.isSpriteMaterial&&b.setValue(t,"center",h.center),b.setValue(t,"modelViewMatrix",h.modelViewMatrix),b.setValue(t,"normalMatrix",h.normalMatrix),b.setValue(t,"modelMatrix",h.matrixWorld),u.uniformsGroups!==0[0]){const e=u.uniformsGroups;for(let t=0,s=e.length;t<s;t++){const n=e[t];G.update(n,w),G.bind(n,w)}}return w}function tt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function nt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return de},this.getActiveMipmapLevel=function(){return K},this.getRenderTarget=function(){return c},this.setRenderTargetTextures=function(e,t,n){const s=o.get(e);s.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,s.__autoAllocateDepthBuffer===!1&&(s.__useRenderToTexture=!1),o.get(e.texture).__webglTexture=t,o.get(e.depthTexture).__webglTexture=s.__autoAllocateDepthBuffer?0[0]:n,s.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){const n=o.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===0[0]},this.setRenderTarget=function(e,s=0,i=0){c=e,de=s,K=i;let r=null,l=!1,d=!1;if(e){const u=o.get(e);if(u.__useDefaultFramebuffer!==0[0]){n.bindFramebuffer(t.FRAMEBUFFER,u.__webglFramebuffer),w.copy(e.viewport),F.copy(e.scissor),V=e.scissorTest,n.viewport(w),n.scissor(F),n.setScissorTest(V),D=-1;return}if(u.__webglFramebuffer===0[0])a.setupRenderTarget(e);else if(u.__hasExternalTextures)a.rebindTextures(e,o.get(e.texture).__webglTexture,o.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){const t=e.depthTexture;if(u.__boundDepthTexture!==t){if(t!==null&&o.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");a.setupDepthRenderbuffer(e)}}const h=e.texture;(h.isData3DTexture||h.isDataArrayTexture||h.isCompressedArrayTexture)&&(d=!0);const c=o.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(Array.isArray(c[s])?r=c[s][i]:r=c[s],l=!0):e.samples>0&&a.useMultisampledRTT(e)===!1?r=o.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?r=c[i]:r=c,w.copy(e.viewport),F.copy(e.scissor),V=e.scissorTest}else w.copy(R).multiplyScalar(v).floor(),F.copy(P).multiplyScalar(v).floor(),V=oe;i!==0&&(r=ye);const u=n.bindFramebuffer(t.FRAMEBUFFER,r);if(u&&n.drawBuffers(e,r),n.viewport(w),n.scissor(F),n.setScissorTest(V),l){const n=o.get(e.texture);t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+s,n.__webglTexture,i)}else if(d){const n=s;for(let s=0;s<e.textures.length;s++){const a=o.get(e.textures[s]);t.framebufferTextureLayer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+s,a.__webglTexture,i,n)}}else if(e!==null&&i!==0){const n=o.get(e.texture);t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,n.__webglTexture,i)}D=-1};function be(e){const t=o.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=p.textureFormatReadable(e.format),t.__typeReadable=p.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,s,i,a,r,l,d,u=0){if(!e||!e.isWebGLRenderTarget){error("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let h=o.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&d!==0[0]&&(h=h[d],Array.isArray(h)&&(h=h[0])),h){n.bindFramebuffer(t.FRAMEBUFFER,h);try{const n=e.textures[u],c=n.format,d=n.type;e.textures.length>1&&t.readBuffer(t.COLOR_ATTACHMENT0+u);const o=be(n);if(o.__formatReadable===!1){error("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(o.__typeReadable===!1){error("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}s>=0&&s<=e.width-a&&i>=0&&i<=e.height-r&&t.readPixels(s,i,a,r,O.convert(c),O.convert(d),l)}finally{const e=c!==null?o.get(c).__webglFramebuffer:null;n.bindFramebuffer(t.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,s,i,a,r,l,d,u=0){if(!e||!e.isWebGLRenderTarget)throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let h=o.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&d!==0[0]&&(h=h[d],Array.isArray(h)&&(h=h[0])),h){if(s>=0&&s<=e.width-a&&i>=0&&i<=e.height-r){n.bindFramebuffer(t.FRAMEBUFFER,h);const d=e.textures[u],g=d.format,v=d.type;e.textures.length>1&&t.readBuffer(t.COLOR_ATTACHMENT0+u);const f=be(d);if(f.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(f.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const m=t.createBuffer();t.bindBuffer(t.PIXEL_PACK_BUFFER,m),t.bufferData(t.PIXEL_PACK_BUFFER,l.byteLength,t.STREAM_READ),t.readPixels(s,i,a,r,O.convert(g),O.convert(v),0),t.bindBuffer(t.PIXEL_PACK_BUFFER,null);const b=c!==null?o.get(c).__webglFramebuffer:null;n.bindFramebuffer(t.FRAMEBUFFER,b);const p=t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0);return t.flush(),await probeAsync(t,p,4),t.bindBuffer(t.PIXEL_PACK_BUFFER,m),t.getBufferSubData(t.PIXEL_PACK_BUFFER,0,l),t.bindBuffer(t.PIXEL_PACK_BUFFER,null),t.deleteBuffer(m),t.deleteSync(p),l}throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(e,s=null,o=0){const i=2**-o,r=Math.floor(e.image.width*i),c=Math.floor(e.image.height*i),l=s!==null?s.x:0,d=s!==null?s.y:0;a.setTexture2D(e,0),t.copyTexSubImage2D(t.TEXTURE_2D,o,0,0,l,d,r,c),n.unbindTexture()},this.copyTextureToTexture=function(e,s,i=null,r=null,c=0,l=0){let f,m,g,v,b,_,d,u,j;const h=e.isCompressedTexture?e.mipmaps[l]:e.image;if(i!==null)f=i.max.x-i.min.x,m=i.max.y-i.min.y,g=i.isBox3?i.max.z-i.min.z:1,v=i.min.x,b=i.min.y,_=i.isBox3?i.min.z:0;else{const t=2**-c;f=Math.floor(h.width*t),m=Math.floor(h.height*t),e.isDataArrayTexture?g=h.depth:e.isData3DTexture?g=Math.floor(h.depth*t):g=1,v=0,b=0,_=0}r!==null?(d=r.x,u=r.y,j=r.z):(d=0,u=0,j=0);const y=O.convert(s.format),w=O.convert(s.type);let p;s.isData3DTexture?(a.setTexture3D(s,0),p=t.TEXTURE_3D):s.isDataArrayTexture||s.isCompressedArrayTexture?(a.setTexture2DArray(s,0),p=t.TEXTURE_2D_ARRAY):(a.setTexture2D(s,0),p=t.TEXTURE_2D),n.activeTexture(t.TEXTURE0),n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,s.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,s.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,s.unpackAlignment);const E=n.getParameter(t.UNPACK_ROW_LENGTH),k=n.getParameter(t.UNPACK_IMAGE_HEIGHT),A=n.getParameter(t.UNPACK_SKIP_PIXELS),S=n.getParameter(t.UNPACK_SKIP_ROWS),M=n.getParameter(t.UNPACK_SKIP_IMAGES);n.pixelStorei(t.UNPACK_ROW_LENGTH,h.width),n.pixelStorei(t.UNPACK_IMAGE_HEIGHT,h.height),n.pixelStorei(t.UNPACK_SKIP_PIXELS,v),n.pixelStorei(t.UNPACK_SKIP_ROWS,b),n.pixelStorei(t.UNPACK_SKIP_IMAGES,_);const C=e.isDataArrayTexture||e.isData3DTexture,x=s.isDataArrayTexture||s.isData3DTexture;if(e.isDepthTexture){const i=o.get(e),a=o.get(s),r=o.get(i.__renderTarget),h=o.get(a.__renderTarget);n.bindFramebuffer(t.READ_FRAMEBUFFER,r.__webglFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,h.__webglFramebuffer);for(let n=0;n<g;n++)C&&(t.framebufferTextureLayer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,o.get(e).__webglTexture,c,_+n),t.framebufferTextureLayer(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,o.get(s).__webglTexture,l,j+n)),t.blitFramebuffer(v,b,v+f,b+m,d,u,d+f,u+m,t.DEPTH_BUFFER_BIT,t.NEAREST);n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null)}else if(c!==0||e.isRenderTargetTexture||o.has(e)){const i=o.get(e),a=o.get(s);n.bindFramebuffer(t.READ_FRAMEBUFFER,Te),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ze);for(let e=0;e<g;e++)C?t.framebufferTextureLayer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,i.__webglTexture,c,_+e):t.framebufferTexture2D(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,i.__webglTexture,c),x?t.framebufferTextureLayer(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,a.__webglTexture,l,j+e):t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,a.__webglTexture,l),c!==0?t.blitFramebuffer(v,b,v+f,b+m,d,u,d+f,u+m,t.COLOR_BUFFER_BIT,t.NEAREST):x?t.copyTexSubImage3D(p,l,d,u,j+e,v,b,f,m):t.copyTexSubImage2D(p,l,d,u,v,b,f,m);n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null)}else x?e.isDataTexture||e.isData3DTexture?t.texSubImage3D(p,l,d,u,j,f,m,g,y,w,h.data):s.isCompressedArrayTexture?t.compressedTexSubImage3D(p,l,d,u,j,f,m,g,y,h.data):t.texSubImage3D(p,l,d,u,j,f,m,g,y,w,h):e.isDataTexture?t.texSubImage2D(t.TEXTURE_2D,l,d,u,f,m,y,w,h.data):e.isCompressedTexture?t.compressedTexSubImage2D(t.TEXTURE_2D,l,d,u,h.width,h.height,y,h.data):t.texSubImage2D(t.TEXTURE_2D,l,d,u,f,m,y,w,h);n.pixelStorei(t.UNPACK_ROW_LENGTH,E),n.pixelStorei(t.UNPACK_IMAGE_HEIGHT,k),n.pixelStorei(t.UNPACK_SKIP_PIXELS,A),n.pixelStorei(t.UNPACK_SKIP_ROWS,S),n.pixelStorei(t.UNPACK_SKIP_IMAGES,M),l===0&&s.generateMipmaps===!0&&s.mipmapsAutoUpdate===!0&&t.generateMipmap(p),n.unbindTexture()},this.initRenderTarget=function(e){o.get(e).__webglFramebuffer===0[0]&&a.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?a.setTextureCube(e,0):e.isData3DTexture?a.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?a.setTexture2DArray(e,0):a.setTexture2D(e,0),n.unbindTexture()},this.resetState=function(){de=0,K=0,c=null,n.reset(),E.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return WebGLCoordinateSystem}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ColorManagement._getDrawingBufferColorSpace(e),t.unpackColorSpace=ColorManagement._getUnpackColorSpace()}}export{ACESFilmicToneMapping,AddEquation,AddOperation,AdditiveBlending,AgXToneMapping,AlphaFormat,AlwaysCompare,AlwaysDepth,ArrayCamera,BackSide,BoxGeometry,BufferAttribute,BufferGeometry,ByteType,CineonToneMapping,ClampToEdgeWrapping,Color,ColorManagement,ConstantAlphaFactor,ConstantColorFactor,CubeCamera,CubeDepthTexture,CubeReflectionMapping,CubeRefractionMapping,CubeTexture,CullFaceBack,CullFaceFront,CullFaceNone,CustomBlending,CustomToneMapping,Data3DTexture,DataArrayTexture,DataTexture,DepthFormat,DepthStencilFormat,DepthTexture,DoubleSide,DstAlphaFactor,DstColorFactor,EqualCompare,EqualDepth,EquirectangularReflectionMapping,EquirectangularRefractionMapping,EventDispatcher,ExternalTexture,Float32BufferAttribute,FloatType,FrontSide,Frustum,FrustumArray,GLSL3,GreaterCompare,GreaterDepth,GreaterEqualCompare,GreaterEqualDepth,HalfFloatType,IntType,Layers,LessCompare,LessDepth,LessEqualCompare,LessEqualDepth,LinearFilter,LinearMipmapLinearFilter,LinearMipmapNearestFilter,LinearSRGBColorSpace,LinearToneMapping,LinearTransfer,Matrix3,Matrix4,MaxEquation,Mesh,MeshDepthMaterial,MeshDistanceMaterial,MinEquation,MirroredRepeatWrapping,MixOperation,MultiplyBlending,MultiplyOperation,NearestFilter,NearestMipmapLinearFilter,NearestMipmapNearestFilter,NeutralToneMapping,NeverCompare,NeverDepth,NoBlending,NoColorSpace,NoToneMapping,NormalBlending,NotEqualCompare,NotEqualDepth,ObjectSpaceNormalMap,OneFactor,OneMinusConstantAlphaFactor,OneMinusConstantColorFactor,OneMinusDstAlphaFactor,OneMinusDstColorFactor,OneMinusSrcAlphaFactor,OneMinusSrcColorFactor,OrthographicCamera,PCFShadowMap,PCFSoftShadowMap,PMREMGenerator,PerspectiveCamera,Plane,PlaneGeometry,R11_EAC_Format,RED_GREEN_RGTC2_Format,RED_RGTC1_Format,REVISION,RG11_EAC_Format,RGBAFormat,RGBAIntegerFormat,RGBA_ASTC_10x10_Format,RGBA_ASTC_10x5_Format,RGBA_ASTC_10x6_Format,RGBA_ASTC_10x8_Format,RGBA_ASTC_12x10_Format,RGBA_ASTC_12x12_Format,RGBA_ASTC_4x4_Format,RGBA_ASTC_5x4_Format,RGBA_ASTC_5x5_Format,RGBA_ASTC_6x5_Format,RGBA_ASTC_6x6_Format,RGBA_ASTC_8x5_Format,RGBA_ASTC_8x6_Format,RGBA_ASTC_8x8_Format,RGBA_BPTC_Format,RGBA_ETC2_EAC_Format,RGBA_PVRTC_2BPPV1_Format,RGBA_PVRTC_4BPPV1_Format,RGBA_S3TC_DXT1_Format,RGBA_S3TC_DXT3_Format,RGBA_S3TC_DXT5_Format,RGBFormat,RGB_BPTC_SIGNED_Format,RGB_BPTC_UNSIGNED_Format,RGB_ETC1_Format,RGB_ETC2_Format,RGB_PVRTC_2BPPV1_Format,RGB_PVRTC_4BPPV1_Format,RGB_S3TC_DXT1_Format,RGFormat,RGIntegerFormat,RawShaderMaterial,RedFormat,RedIntegerFormat,ReinhardToneMapping,RepeatWrapping,ReverseSubtractEquation,SIGNED_R11_EAC_Format,SIGNED_RED_GREEN_RGTC2_Format,SIGNED_RED_RGTC1_Format,SIGNED_RG11_EAC_Format,SRGBColorSpace,SRGBTransfer,ShaderChunk,ShaderLib,ShaderMaterial,ShortType,SrcAlphaFactor,SrcAlphaSaturateFactor,SrcColorFactor,SubtractEquation,SubtractiveBlending,TangentSpaceNormalMap,Texture,Uint16BufferAttribute,Uint32BufferAttribute,UniformsLib,UniformsUtils,UnsignedByteType,UnsignedInt101111Type,UnsignedInt248Type,UnsignedInt5999Type,UnsignedIntType,UnsignedShort4444Type,UnsignedShort5551Type,UnsignedShortType,VSMShadowMap,Vector2,Vector3,Vector4,WebGLCoordinateSystem,WebGLCubeRenderTarget,WebGLRenderTarget,WebGLRenderer,WebGLUtils,WebXRController,ZeroFactor,createCanvasElement,error,log,warn,warnOnce}